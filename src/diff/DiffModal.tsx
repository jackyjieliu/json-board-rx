import * as React from 'react';
import './DiffModal.css';
import {Color} from '../settings';
import {DiffObject} from '../board-container/BoardContainerViewData';
import * as _ from 'lodash';
import Modal from '../modal/Modal';

interface Prop {
  color: Color;
  fontSize: number;
  onClose: () => void ;
  diffObject: DiffObject[];
}

interface ReducedDiffObject {
  value?: string;
  added?: string;
  removed?: string;
}
export default class DiffModal extends React.Component<Prop, null> {


  buildTableData(diffObjs: DiffObject[]) {
    const result: ReducedDiffObject[] = [];
    for (let i = 0; i < diffObjs.length; i++) {
      const diffObj = diffObjs[i];

      if (!diffObj.added && !diffObj.removed) {
        diffObj.value
          .replace(/\n$/, '')
          .split('\n')
          .forEach(value => {
            return result.push({ value });
          });
      } else {
        let nextObj: DiffObject | undefined = undefined;
        let added = '';
        let removed = '';
        if (i + 1 < diffObjs.length) {
          nextObj = diffObjs[i + 1];
        }

        if (diffObj.added) {
          added = diffObj.value;
          if (nextObj && nextObj.removed) {
            removed = nextObj.value;
            i++;
          }
        } else {
          removed = diffObj.value;
          if (nextObj && nextObj.added) {
            added = nextObj.value;
            i++;
          }
        }

        _.merge(
          added
            .replace(/\n$/, '')
            .split('\n')
            .map(addedStr => {
              return { added: addedStr };
            }),
          removed
            .replace(/\n$/, '')
            .split('\n')
            .map(removedStr => {
              return { removed: removedStr };
            })
        ).forEach((merged) => {
          result.push(_.defaults(merged,  {added: '', removed: '' }));
        });
      }
    }
    return result;
  }
  buildTable(diffObjs: DiffObject[]) {
      return this.buildTableData(diffObjs)
        .map((diffLine: ReducedDiffObject, i) => {

          let left = diffLine.value;
          let right = diffLine.value;
          let leftClass = 'line word-wrap';
          let rightClass = 'line word-wrap';
          if (diffLine.added) {
            left = diffLine.added;
            leftClass += ' added';
          }

          if (diffLine.removed) {
            right = diffLine.removed;
            rightClass += ' removed';
          }

          return (
            <tr key={i}>
              <td>{i + 1}.</td>
              <td className={leftClass}>
                <span>{left}</span>
              </td>
              <td>{i + 1}.</td>
              <td className={rightClass}>
                <span>{right}</span>
              </td>
            </tr>
          );
        });
  }

  render() {
    const textBack = this.props.color.textBack;
    const textColor = this.props.color.textColor;
    const theme = this.props.color.theme;
    return (
      <Modal color={this.props.color} onClose={this.props.onClose} full={true}>
        <div className={textBack + ' diff-modal full-row scroll card-panel'}>
          <table>
            <tbody className={theme} style={{color: textColor, fontSize: this.props.fontSize}}>
              {this.buildTable(this.props.diffObject)}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}
