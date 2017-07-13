// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Revised search plugin written by Jamie Morris
// Define search commands. Depends on advanceddialog.js

// Source https://github.com/Maloric/CodeMirror-RevisedSearch

import * as CodeMirror from 'codemirror';
import 'codemirror-advanceddialog';
import './codemirror-search.css';

var findDialog = `
  <div class="find">
    <input
      id="CodeMirror-find-field"
      type="text"
      class="CodeMirror-search-field"
      placeholder="Search"
    />
    <button>
      <a class="grey darken-2 waves-effect waves-light btn">
        <i class="material-icons">keyboard_arrow_up</i>
      </a>
    </button>
    <button>
      <a class="grey darken-2 waves-effect waves-light btn">
        <i class="material-icons">keyboard_arrow_down</i>
      </a>
    </button>
    <button>
      <a class="grey darken-2 waves-effect waves-light btn">
        <i class="material-icons">close</i>
      </a>
    </button>
  </div>
`;

let searchOverlay = (query: any, caseInsensitive: any) => {
  if (typeof query === 'string') {
    query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), caseInsensitive ? 'gi' : 'g');
  } else if (!query.global) {
    query = new RegExp(query.source, query.ignoreCase ? 'gi' : 'g');
  }

  return {
    token: (stream: any) => {
      query.lastIndex = stream.pos;
      var match = query.exec(stream.string);
      if (match && match.index === stream.pos) {
        stream.pos += match[0].length || 1;
        return 'searching';
      } else if (match) {
        stream.pos = match.index;
      } else {
        stream.skipToEnd();
      }
      return;
    }
  };
};

class SearchState {
  public posFrom: any;
  public posTo: any;
  public lastQuery: any;
  public query: any;
  public overlay: any;

  constructor() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
  }
}

// function SearchState() {
//   this.posFrom = this.posTo = this.lastQuery = this.query = null;
//   this.overlay = null;
// }

let getSearchState = (cm: any) => {
  return cm.state.search || (cm.state.search = new SearchState());
}

let queryCaseInsensitive = (query: any) => {
  return typeof query === 'string' && query === query.toLowerCase();
}

let getSearchCursor = (cm: any, query: any, pos: any) => {
  // Heuristic: if the query string is all lowercase, do a case insensitive search.
  return cm.getSearchCursor(parseQuery(query), pos, queryCaseInsensitive(query));
}

let parseString = (string: any) => {
  return string.replace(/\\(.)/g, (_: any, ch: any) => {
    if (ch === 'n') {
      return '\n';
    }
    if (ch === 'r') {
      return '\r';
    }
    return ch;
  })
}

let parseQuery = (query: any) => {
  if (query.exec) {
    return query;
  }
  var isRE = query.indexOf('/') === 0 && query.lastIndexOf('/') > 0;
  if (!!isRE) {
    try {
      let matches = query.match(/^\/(.*)\/([a-z]*)$/);
      query = new RegExp(matches[1], matches[2].indexOf('i') === -1 ? '' : 'i');
    } catch (e) {} // Not a regular expression after all, do a string search
  } else {
    query = parseString(query);
  }
  if (typeof query === 'string' ? query === '' : query.test('')) {
    query = /x^/;
  }
  return query;
}

let startSearch = (cm: any, state: any, query: any) => {
  if (!query || query === '') {
    return;
  }
  state.queryText = query;
  state.query = parseQuery(query);
  cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
  state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
  cm.addOverlay(state.overlay);
  if (cm.showMatchesOnScrollbar) {
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
    state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
  }
}

let doSearch = (cm: any, query: any, reverse: any, moveToNext: any) => {
  var state = getSearchState(cm);
  if (query !== state.queryText) {
    startSearch(cm, state, query);
    state.posFrom = state.posTo = cm.getCursor();
  }
  if (moveToNext || moveToNext === undefined) {
    findNext(cm, (reverse || false), undefined);
  }
  updateCount(cm);
};

let clearSearch = (cm: any) => {
  cm.operation(() => {
    var state = getSearchState(cm);
    state.lastQuery = state.query;
    if (!state.query)  { return; }
    state.query = state.queryText = null;
    cm.removeOverlay(state.overlay);
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
  });
};

let findNext = (cm: any, reverse: any, callback: any) => {
  cm.operation(() => {
    var state = getSearchState(cm);
    var cursor = getSearchCursor(cm, state.query, reverse ? state.posFrom : state.posTo);
    if (!cursor.find(reverse)) {
      cursor = getSearchCursor(cm, state.query, reverse ?
        CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
      if (!cursor.find(reverse)) { return; }
    }
    cm.setSelection(cursor.from(), cursor.to());
    cm.scrollIntoView({
      from: cursor.from(),
      to: cursor.to()
    }, 20);
    state.posFrom = cursor.from();
    state.posTo = cursor.to();
    if (callback) {
      callback(cursor.from(), cursor.to())
    }
  });
};

let closeSearchCallback = (cm: any, state: any) => {
  if (state.annotate) {
    state.annotate.clear();
    state.annotate = null;
  }
  cm.closeFind = undefined;
  clearSearch(cm);
  cm.focus();
}

let getOnReadOnlyCallback = (callback: any) => {
  let closeFindDialogOnReadOnly = (cm: any, opt: any) => {
    if (opt === 'readOnly' && !!cm.getOption('readOnly')) {
      callback();
      cm.off('optionChange', closeFindDialogOnReadOnly);
    }
  }
  return closeFindDialogOnReadOnly;
};

let updateCount = (cm: any) => {
  // let state = getSearchState(cm);
  // let value = cm.getDoc().getValue();
  // let globalQuery;
  // let queryText = state.queryText;

  // if (!queryText || queryText === '') {
  //   resetCount(cm);
  //   return;
  // }

  // while (queryText.charAt(queryText.length - 1) === '\\') {
  //   queryText = queryText.substring(0, queryText.lastIndexOf('\\'));
  // }

  // if (typeof state.query === 'string') {
  //   globalQuery = new RegExp(queryText, 'ig');
  // } else {
  //   globalQuery = new RegExp(state.query.source, state.query.flags + 'g');
  // }

  // let matches = value.match(globalQuery);
  // let count = matches ? matches.length : 0;

  // let countText = count === 1 ? '1 match found.' : count + ' matches found.';
  // cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = countText;
}

let resetCount = (cm: any) => {
  // cm.getWrapperElement().parentNode.querySelector('.CodeMirror-search-count').innerHTML = '';
}

let getFindBehaviour = (cm: any, defaultText: any, callback: any) => {
  if (!defaultText) {
    defaultText = '';
  }
  let behaviour = {
    value: defaultText,
    focus: true,
    selectValueOnOpen: true,
    closeOnEnter: false,
    closeOnBlur: false,
    callback: (inputs: any, e: any) => {
      let query = inputs[0].value;
      if (!query) { return; }
      doSearch(cm, query, !!e.shiftKey, undefined);
    },
    onInput: (inputs: any, e: any) => {
      let query = inputs[0].value;
      if (!query) {
        resetCount(cm);
        clearSearch(cm);
        return;
      };

      // Auto find on search
      doSearch(cm, query, !!e.shiftKey, undefined);
      // Original
      // doSearch(cm, query, !!e.shiftKey, false);
    }
  };
  if (!!callback) {
    behaviour.callback = callback;
  }
  return behaviour;
};

let getFindPrevBtnBehaviour = (cm: any) => {
  return {
    callback: (inputs: any) => {
      let query = inputs[0].value;
      if (!query) { return; }
      doSearch(cm, query, true, undefined);
    }
  };
};

let getFindNextBtnBehaviour = (cm: any) => {
  return {
    callback: (inputs: any) => {
      let query = inputs[0].value;
      if (!query) { return; }
      doSearch(cm, query, false, undefined);
    }
  };
};

let closeBtnBehaviour = {
  callback: null
};

CodeMirror.commands.find = (cm: any) => {
  if (cm.getOption('readOnly')) { return; }
  clearSearch(cm);
  let state = getSearchState(cm);
  var query = cm.getSelection() || getSearchState(cm).lastQuery;
  let closeDialog = cm.openAdvancedDialog(findDialog, {
    shrinkEditor: true,
    inputBehaviours: [
      getFindBehaviour(cm, query, undefined)
    ],
    buttonBehaviours: [
      getFindPrevBtnBehaviour(cm),
      getFindNextBtnBehaviour(cm),
      closeBtnBehaviour
    ],
    onClose: () => {
      closeSearchCallback(cm, state);
    }
  });

  cm.closeFind = closeDialog.bind(this);
  cm.on('optionChange', getOnReadOnlyCallback(closeDialog));
  startSearch(cm, state, query);
  updateCount(cm);
};
