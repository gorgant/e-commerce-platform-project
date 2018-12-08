import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }



  ngOnInit() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Form submitted', this.checkoutForm.value);
    this.router.navigate(['../order-success', 'orderid'], { relativeTo: this.route });
  }

  // These getters are used for easy access in the HTML template
  get name() { return this.checkoutForm.get('name'); }
  get address1() { return this.checkoutForm.get('address1'); }
  get address2() { return this.checkoutForm.get('address2'); }
  get city() { return this.checkoutForm.get('city'); }

}
