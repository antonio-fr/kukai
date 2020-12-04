import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  spinnerOn = false;
  spinnerText = '';
  messages: any[] = [];
  defaultTime = 10;
  add(message: string, seconds: number = this.defaultTime) {
    const type = 'info';
    console.log(type + ': ' + message);
    this.messages.push({
      type: type,
      msg: message,
      timeout: seconds * 1000
    });
  }
  addError(message: string, seconds: number = this.defaultTime) {
    const type = 'danger';
    console.log(type + ': ' + message);
    this.messages.push({
      type: type,
      msg: message,
      timeout: seconds * 1000
    });
  }
  addWarning(message: string, seconds: number = this.defaultTime) {
    const type = 'warning';
    console.log(type + ': ' + message);
    this.messages.push({
      type: type,
      msg: message,
      timeout: seconds * 1000
    });
  }
  addSuccess(message: string, seconds: number = this.defaultTime) {
    const type = 'success';
    console.log(type + ': ' + message);
    this.messages.push({
      type: type,
      msg: message,
      timeout: seconds * 1000
    });
  }
  emailNotify(email: string, amount: string) {
    console.log(email);
    const type = 'success';
    this.messages.push({
      type: type,
      timeout: 0,
      msg: 'email',
      email,
      amount
    });
  }
  redditNotify(username: string, amount: string) {
    console.log(username);
    const type = 'success';
    this.messages.push({
      type: type,
      timeout: 0,
      msg: 'Reddit',
      username,
      amount
    });
  }
  twitterNotify(twitterId: string, handler: string, amount: string) {
    console.log(twitterId);
    const type = 'success';
    this.messages.push({
      type: type,
      timeout: 0,
      msg: 'Twitter',
      twitterId,
      handler,
      amount
    });
  }
  addBeaconWait(message: string) {
    const type = 'info';
    this.messages.push({
      type: type,
      msg: message,
      timeout: 30 * 1000,
      loader: true
    });
  }
  stopBeaconWait() {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].loader) {
        this.messages.splice(i, 1);
        break;
      }
    }
    this.addSuccess('Pairing completed!', 5)
  }
  clear() {
    this.messages = [];
  }
  async startSpinner(text: string = '') {
    this.spinnerText = text;
    this.spinnerOn = true;
  }
  async stopSpinner() {
    this.spinnerText = '';
    this.spinnerOn = false;
  }
}
