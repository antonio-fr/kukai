import { Component, TemplateRef, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';

import { WalletService } from '../../services/wallet.service';
import { MessageService } from '../../services/message.service';
import { TransactionService } from '../../services/transaction.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { KeyPair } from '../../interfaces';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
    @ViewChild('modal1') modal1: TemplateRef<any>;
    accounts = null;
    @Input() activePkh: string;
    @Input() accounts2: any;
    activeAccount = null;
    toPkh: string;
    amount: string;
    fee: string;
    password: string;
    pwdValid: string;
    formInvalid = '';
    sendResponse: string;

    modalRef1: BsModalRef;
    modalRef2: BsModalRef;
    modalRef3: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private walletService: WalletService,
        private messageService: MessageService,
        private transactionService: TransactionService
    ) { }

    ngOnInit() {
        if (this.accounts2) {
            this.activeAccount = this.accounts2;
            console.log('activeAccount', this.activeAccount);
            console.log('activeAccount.pkh', this.activeAccount.pkh);
            console.log('activeAccount.balance.balanceXTZ', this.activeAccount.balance.balanceXTZ / 1000000);

            console.log('accounts2', this.accounts2);
        }

        if (this.walletService.wallet) {
            this.init();
        }
    }

    init() {
        this.accounts = this.walletService.wallet.accounts;
    }

    showAccountBalance(accountPkh: string) {
        let accountBalance: number;
        let accountBalanceString: string;
        let index;
        // finding the index
        index = this.accounts.findIndex(account => account.pkh === accountPkh);

        accountBalance = this.accounts[index].balance.balanceXTZ / 1000000;
        accountBalanceString = this.numberWithCommas(accountBalance) + ' ꜩ';

        return accountBalanceString;
    }

    numberWithCommas(x: number) {
        let parts: Array<string> = [];
        parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    sendEntireBalance(accountPkh: string, event: Event) {
        event.stopPropagation();

        let accountBalance: number;
        let index;

        // finding the index
        index = this.accounts.findIndex(account => account.pkh === accountPkh);

        accountBalance = this.accounts[index].balance.balanceXTZ / 1000000;

        this.amount = accountBalance.toString();
    }

    open1(template1: TemplateRef<any>) {
        this.clearForm();
        this.modalRef1 = this.modalService.show(template1, { class: 'first' });
        /*
        this.modalRef1 = this.modalService.show(
        template1,
        Object.assign({}, { class: 'gray modal-lg' })
        );
        */
    }
    open2(template: TemplateRef<any>) {
        this.formInvalid = this.invalidInput();
        if (!this.formInvalid) {
            if (!this.amount) { this.amount = '0'; }
            if (!this.fee) { this.fee = '0'; }
            this.close1();
            this.modalRef2 = this.modalService.show(template, { class: 'second' });
        }
    }
    async open3(template: TemplateRef<any>) {
        const pwd = this.password;
        this.password = '';
        let keys;
        if (keys = this.walletService.getKeys(pwd)) {
            this.pwdValid = '';
            this.close2();
            this.modalRef3 = this.modalService.show(template, { class: 'third' });
            this.sendTransaction(keys);
        } else {
            this.pwdValid = 'Wrong password!';
        }
    }

    close1() {
        this.modalRef1.hide();
        this.modalRef1 = null;
    }

    close2() {
        this.modalRef2.hide();
        this.modalRef2 = null;
    }

    close3() {
        this.modalRef3.hide();
        this.modalRef3 = null;
    }

    async sendTransaction(keys: KeyPair) {

        const toPkh = this.toPkh;
        let amount = this.amount;
        let fee = this.fee;
        this.toPkh = '';
        this.amount = '';
        this.fee = '';

        if (!amount) {
            amount = '0';
        }

        if (!fee) {
            fee = '0';
        }

        setTimeout(async () => {
            if (await this.transactionService.sendTransaction(keys, this.activePkh, toPkh, Number(amount), Number(fee) * 100)) {
                this.sendResponse = 'success';
            } else {
                this.sendResponse = 'failure';
            }
        }, 100);
    }
    clearForm() {
        this.toPkh = '';
        this.amount = '';
        this.fee = '';
        this.password = '';
        this.pwdValid = '';
        this.formInvalid = '';
        this.sendResponse = '';
    }
    invalidInput(): string {

        if (!this.toPkh || this.toPkh.length !== 36) {
            return 'invalid receiver address';
        } else if (!Number(this.amount) && this.amount && this.amount !== '0') {
            return 'invalid amount';
        } else if (!Number(this.fee) && this.fee && this.fee !== '0') {
            return 'invalid fee';
        } else {
            return '';
        }
    }
}
