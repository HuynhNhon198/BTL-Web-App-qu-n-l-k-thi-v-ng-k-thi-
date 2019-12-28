import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { helperService } from 'src/app/_services/helper.service';
// import { SignService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { FirebaseAuthServices } from 'src/app/_services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})

export class LoginComponent implements AfterViewInit {
  @ViewChild('pass', { static: false }) passElement: ElementRef;
  hide = true;
  username = '';
  ngAfterViewInit(): void {
  }

  // tslint:disable-next-line: max-line-length
  constructor(private helper: helperService, private router: Router, private fbAuthServices: FirebaseAuthServices) { }

  logIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.fbAuthServices.signIn(form.value.username, form.value.password).then(() => {
      form.resetForm();
      this.router.navigate(['/']);
      // .then(() => {
      //   window.location.reload();
      // });
    }).catch(err => {
      this.helper.noty('error', 3000, err.code);
    });
  }
  logout() {
    this.fbAuthServices.logOut();
  }
  resetPass() {
    this.fbAuthServices.resetPass(this.username).then((email) => {
      this.helper.noty('success', 10000, 'Vui lòng kiểm tra email: ' + email + ' để xác nhận đổi mật khẩu mới')
    });
  }
  openMail() {
    // tslint:disable-next-line: max-line-length
    const win = window.open('https://mail.google.com/mail/u/0/?view=cm&fs=1&to=huynhnhon.dev@gmail.com&su=TI%C3%8AU%20%C4%90%E1%BB%80&body=N%E1%BB%99i%20dung...&tf=1', '_blank');
    win.focus();
  }
}
