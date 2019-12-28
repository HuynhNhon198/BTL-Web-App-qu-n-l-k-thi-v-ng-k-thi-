import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { helperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  id: string;
  profile: any;

  constructor(private route: ActivatedRoute, private helper: helperService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {

  }

}
