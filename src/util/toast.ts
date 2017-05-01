

export default function toast(message: string, duration: number = 5000) {
  Materialize.toast(message, duration);
}