import { Injectable, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as Fuse from 'fuse.js';
import { Notyf } from 'notyf';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

// option cho Fuse: tìm kiếm full text search
const options: Fuse.FuseOptions<any> = {
  tokenize: true,
  threshold: 0,
  location: 0,
  distance: 0,
};

@Injectable()
// tslint:disable-next-line: class-name
export class helperService {

  // Collection Phòng thi
  private roomsCol: AngularFirestoreCollection<any>;

  // Quyền người dùng
  public RoleName = [
    {
      id: 0,
      name: 'Người Mới'
    }, {
      id: 1,
      name: 'Sinh Viên'
    }, {
      id: 2,
      name: 'Quản Trị Viên'
    }
  ];

  // Giới tính
  public gender = [
    {
      id: 0,
      name: 'KHÔNG XÁC ĐỊNH'
    }, {
      id: 1,
      name: 'NAM'
    }, {
      id: 2,
      name: 'NỮ'
    }
  ];

  // rootUrl server
  public rootUrl = 'http://localhost:4000/api/v1/';
  // public rootUrl = 'https://examreg.appspot.com/api/v1/';

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore
    // @Inject(NOTYF) private notyf: Notyf
  ) {

  }

  //  subcribe phòng thi
  subRoom() {
    this.roomsCol = this.afs.collection('Rooms');
    return this.roomsCol.valueChanges();
  }

  // sắp xếp mảng theo loai: asc hoặc desc
  sortArrayByKey(array, key: string, type: string) {
    if (type === 'asc') {
      return array.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0));
    }
  }

  // Sinh ra số milisec từ ngày truyền vào
  create_milisec(date) {
    const d = (date === '' ? new Date() : new Date(date)).getTime().toString();
    return Number(d.substring(0, d.length - 3));
  }

  // full text search
  fullTextSearch(dataToSearch, value, keys) {
    options.keys = keys;
    const fuse = new Fuse(dataToSearch, options);
    return fuse.search(value);
  }

  // khởi tạo 1 snackbar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  // tạo một thông báo với type: success hoặc error
  noty(type: string, duration: number, message: string) {
    const notyf = new Notyf({
      ripple: true,
      duration,
      types: [
        {
          type: 'success',
          backgroundColor: 'rgba(0, 213, 59, 0.7)'
        }
      ]
    });
    notyf.open({
      type,
      message
    });
  }

  // validate ngày sinh
  validateBirthday(input: string) {
    const reg1 = /([0-3]?\d\/{1})([01]?\d\/{1})([12]{1}\d{3})/;
    const reg2 = /([0-3]?\d\/{1})([01]?\d\/{1})([12]{1}\d{1})/;
    if (reg1.test(input)) {
      return true;
    } else if (reg2.test(input)) {
      return true;
    } else { return false; }
  }
}
