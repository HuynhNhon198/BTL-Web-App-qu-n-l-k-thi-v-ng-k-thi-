import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { of, Observable, Subject } from 'rxjs';
import { UserProfile } from '../_models/auth.models';
import { switchMap } from 'rxjs/operators';
import { User } from 'firebase';
import { MakeRequest } from './request.service';
import { helperService } from './helper.service';
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthServices {
  user$: Observable<any>; // khởi tạo một observiable cho user
  user: UserProfile = null;
  idToken = '';
  private userUpdated = new Subject<UserProfile>();

  constructor(
    private afireAuth: AngularFireAuth,
    private http: MakeRequest,
    private helper: helperService
  ) {
    // lắng nghe thay đổi tài khoản
    this.user$ = this.afireAuth.authState.pipe(
      switchMap(async user => {
        // Logged in
        if (user) {
          // console.log(user);
          await user.getIdTokenResult().then(async result => {
            await user.getIdToken().then(token => (this.idToken = token));
            if (!!result.claims.admin) {
              // tslint:disable-next-line: no-string-literal
              user['role'] = 1;
              user['roleName'] = 'Admin';
            }
            if (!!result.claims.student) {
              user['role'] = 2;
              user['roleName'] = 'Sinh Viên';
            }
          });
          return of(user);
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  // trả về một observable của user
  getUserData() {
    return this.userUpdated.asObservable();
  }

  // kiểm tra trạng thái đăng nhập
  get authenticated(): boolean {
    return this.afireAuth.authState !== null;
  }

  get currentUserObservable(): any {
    return this.afireAuth.auth;
  }

  // reset mật khẩu
  resetPass(username) {
    try {
      return new Promise(async (r, j) => {
        // lấy email từ username
        (await this.http.GETmethod({ url: this.helper.rootUrl + 'user/get-email?username=' + username })).subscribe(res => {
          // Gửi email xác nhận đổi mật khẩu
          this.afireAuth.auth.sendPasswordResetEmail(res).then(() => {
            r(res);
          }).catch(err => {
            j(err);
          });
        }, err => {
          this.helper.noty('error', 3000, 'CÓ LỖI XẢY RA, VUI LÒNG KIỂM TRA LẠI');
        });

      });
    } catch (e) {
      console.log(e);
    }
  }

  // đăng nhập
  signIn(username, pass) {
    try {
      return new Promise(async (r, j) => {
        // lấy email từ server
        (await this.http.GETmethod({ url: this.helper.rootUrl + 'user/get-email?username=' + username })).subscribe(res => {
          // đăng nhập vào firebase bằng email và password
          this.afireAuth.auth.signInWithEmailAndPassword(res, pass).then(() => {
            r();
          }).catch(err => {
            j(err);
          });
        }, err => {
          console.log(err);
          this.helper.openSnackBar(err.error, 'OK');
        })

      });
    } catch (e) {
      console.log(e);
    }
  }

  // đăng xuất
  async logOut() {
    try {
      await this.afireAuth.auth.signOut();
    } catch (error) { }
  }
}
