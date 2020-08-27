// import {
//   Component,
//   ElementRef,
//   OnChanges,
//   OnDestroy,
//   OnInit,
//   SimpleChanges,
// } from "@angular/core";
// import { ViewChild } from "@angular/core";
// import { EstimateService } from "../estimate.service";
// import { MatStepper, MatHorizontalStepper } from "@angular/material/stepper";
// import { NgForm } from "@angular/forms";
// import { QuestionService } from "../../home/question.service";
// import { Subscription } from "rxjs";
// import { UsersService } from "../../services/user.service";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { Router } from "@angular/router";
// import { FormControl, Validators } from "@angular/forms";
// import { ViewEncapsulation } from "@angular/core";
// import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

// @Component({
//   selector: "app-stepper-component",
//   templateUrl: "./stepper-component.component.html",
//   styleUrls: ["./stepper-component.component.css"],
//   providers: [
//     {
//       provide: STEPPER_GLOBAL_OPTIONS,
//       useValue: { displayDefaultIndicatorType: false },
//     },
//   ],
//   encapsulation: ViewEncapsulation.None,
// })
// export class StepperComponentComponent implements OnInit, OnDestroy {
//   fetchedJson;
//   num = 0;
//   checked = false;
//   btnLoading = false;
//   submitDisabled = true;
//   nameValidation = new FormControl("", [Validators.required]);
//   emailReg = new FormControl("", [Validators.required]);
//   emailValidation = new FormControl("", [
//     Validators.required,
//     Validators.email,
//   ]);

//   userAnswer = [];

//   constructor(
//     public estimateService: EstimateService,
//     public questionService: QuestionService,
//     public usersService: UsersService,
//     private _snackBar: MatSnackBar,
//     private router: Router
//   ) {}

//   private questionSubscription: Subscription;

//   ngOnDestroy(): void {
//     if (!this.fetchedJson) {
//       this.questionSubscription.unsubscribe();
//     }
//   }

//   ngOnInit(): void {
//     this.fetchedJson = this.questionService.infoFetched;
//     /// if our page reloads on /estimate route, we will not be able to fetch data
//     /// so here I am checking is this.fetchedJson undefined,
//     /// if it is that means that we are on the same route so fetch data again
//     if (!this.fetchedJson) {
//       console.log("Reload on the same route");
//       this.questionService.getQuestions();
//       this.questionSubscription = this.questionService
//         .getQuestionsUpdated()
//         .subscribe((questions) => {
//           this.fetchedJson = questions.questions[0];
//           console.log(this.questionService.infoFetched);
//         });
//     }
//   }

//   openSnackBar() {
//     this._snackBar.open("You can only select one answer", "", {
//       duration: 1000,
//     });
//   getTimeAndPrice(event, price: number, time: number, radio: boolean, num: number, pages:any, answer: any, chosen: boolean, pageID: number, i: number, page: any, questionName: string, coefficient: number) {
//        /// function for disabling other choices if one is checked
//       /// in radio === true objects
//        if(radio) {
//          pages.forEach(x => {
//            if (x.id !== page.id) {
//              x.disabled = !x.disabled
//            }
//          });
//        }
//        console.log(coefficient);
//       this.addAnswersIfTheyAreChosen(chosen, answer, pageID, questionName);
//       this.estimateService.sendEstimatedTimeAndPrice(event, price, time, radio, num, pageID, pages, i, coefficient);
//   }

//   emptyFun() {
//     console.log("Empty");
//   }

//   getTimeAndPrice(
//     event,
//     price: number,
//     time: number,
//     radio: boolean,
//     num: number,
//     pages: any,
//     answer: any,
//     chosen: boolean,
//     pageID: number,
//     i: number,
//     page: any,
//     questionName: string
//   ) {
//     /// function for disabling other choices if one is checked
//     /// in radio === true objects
//     if (radio) {
//       pages.forEach((x) => {
//         if (x.id !== page.id) {
//           x.disabled = !x.disabled;
//         }
//       });
//     }
//     this.addAnswersIfTheyAreChosen(chosen, answer, pageID, questionName);
//     this.estimateService.sendEstimatedTimeAndPrice(
//       event,
//       price,
//       time,
//       radio,
//       num,
//       pageID,
//       pages,
//       i
//     );
//   }

//   addAnswersIfTheyAreChosen(
//     chosen: boolean,
//     answer: any,
//     pageID: number,
//     questionName: string
//   ) {
//     /// collect selected answers
//     /// if answer is chosen then add it to [this,userAnswer]
//     /// else
//     /// if you unchecked the answer we will set chosen to false and remove
//     /// the last added item in array
//     if (!chosen) {
//       const answers = {
//         questionName: questionName,
//         answer: answer,
//         choiceID: pageID,
//       };
//       console.log(answers);
//       this.userAnswer.push(answers);
//       console.log(this.userAnswer);
//     } else {
//       this.userAnswer = this.userAnswer.filter(
//         ({ choiceID }) => choiceID !== pageID
//       );
//       console.log(this.userAnswer);
//     }
//   }

//   getUsersAnswers() {
//     this.btnLoading = true;
//     this.saveAnswersInDB();
//     setTimeout(() => {
//       this.router
//         .navigate(["/estimate/confirmation"])
//         .then(() => console.log("Navigation ended"));
//     }, 1000);
//   }

//   @ViewChild("name") name: ElementRef;
//   @ViewChild("email") email: ElementRef;
//   saveAnswersInDB() {
//     /// getting final versions of time and price through estimateService
//     const time = this.estimateService.estimatedTimeAndPrice.time;
//     const price = this.estimateService.estimatedTimeAndPrice.price;
//     /// getting name and email
//     const name = this.name.nativeElement.value;
//     const email = this.email.nativeElement.value;
//     /// call function from usersService to send data to the backend and db
//     console.log("Time " + time.toString());
//     console.log("price " + price.toString());
//     console.log("name " + name.toString());
//     console.log("email " + email.toString());
//     console.log(this.userAnswer);
//     this.usersService.getUsersAnswers(
//       this.userAnswer,
//       time,
//       price,
//       name,
//       email
//     );

//     /// reset after submitting
//     this.estimateService.estimatedTimeAndPrice.price = 0;
//     this.estimateService.estimatedTimeAndPrice.time = 0;
//     this.userAnswer = [];
//   }

//   buttonState() {
//     if (this.num == this.fetchedJson["pages"].length - 1) {
//       return true;
//     } else {
//       return !this.fetchedJson.pages[this.num].some((page) => page.chosen);
//     }
//   }

//   ///Validation for name input field
//   getErrorMessageName() {
//     if (this.nameValidation.hasError("required")) {
//       this.submitDisabled = true;
//       return "You must enter a value";
//     }

//     if (!this.nameValidation.hasError("required")) {
//       this.submitDisabled = false;
//       console.log("hahahha");
//     }
//   }
//   getErrorMessageEmail() {
//     if (this.emailReg.hasError("required")) {
//       return "Email field cant be empty";
//     }
//   }

//   ///Validation for email input field
//   //  getErrorMessageEmail() {
//   //   if (this.emailValidation.hasError('required')) {
//   //     this.submitDisabled = true;
//   //     return 'You must enter a value';
//   //   } else {
//   //     this.submitDisabled = false;
//   //   }
//   //    return this.emailValidation.hasError('email') ? 'Not a valid email' : '';
//   // }

//   changeWidth() {
//     if (this.num === this.fetchedJson["pages"].length - 1) {
//       return "200px";
//     } else {
//       return null;
//     }
//   }

//   ///function that returns a class for input fields based on number of page
// getClass(){
//   if(this.num === this.fetchedJson['pages'].length - 1){
//     return 'lastPageInput'
//   }else{
//     return 'inputGroup'
//   }
// }

//   @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
//   @ViewChild("stepper") private myStepper: MatStepper;
//   goBack(stepper: MatStepper) {
//     this.myStepper.previous();
//     this.num -= 1;
//   }
//   goForward(stepper: MatStepper) {
//     this.stepper.selected.completed = true;
//     this.stepper.selected.editable = false;
//     this.myStepper.next();
//     this.num += 1;
//   }
//   onSendEmail(form: NgForm) {
//     console.log("users name is ", form.value.name);
//     console.log("users email is ", form.value.email);
//   }
// }

// // rgb(86, 189, 234) plava - current state

import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { ViewChild } from "@angular/core";
import { EstimateService } from "../estimate.service";
import { MatStepper, MatHorizontalStepper } from "@angular/material/stepper";
import { NgForm } from "@angular/forms";
import { QuestionService } from "../../home/question.service";
import { Subscription } from "rxjs";
import { UsersService } from "../../services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { ViewEncapsulation } from "@angular/core";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

@Component({
  selector: "app-stepper-component",
  templateUrl: "./stepper-component.component.html",
  styleUrls: ["./stepper-component.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class StepperComponentComponent implements OnInit, OnDestroy {
  constructor(
    public estimateService: EstimateService,
    public questionService: QuestionService,
    public usersService: UsersService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  private questionSubscription: Subscription;

  ngOnDestroy(): void {
    if (!this.fetchedJson) {
      this.questionSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fetchedJson = this.questionService.infoFetched;
    /// if our page reloads on /estimate route, we will not be able to fetch data
    /// so here I am checking is this.fetchedJson undefined,
    /// if it is that means that we are on the same route so fetch data again
    if (!this.fetchedJson) {
      console.log("Reload on the same route");
      this.questionService.getQuestions();
      this.questionSubscription = this.questionService
        .getQuestionsUpdated()
        .subscribe((questions) => {
          this.fetchedJson = questions.questions[0];
          console.log(this.questionService.infoFetched);
        });
    }
  }

  fetchedJson;
  num = 0;
  checked = false;
  btnLoading = false;
  submitDisabled = true;
  nameValidation = new FormControl("", [Validators.required]);
  emailReg = new FormControl("", [Validators.required]);
  emailValidation = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  userAnswer = [];

  openSnackBar() {
    this._snackBar.open("You can only select one answer", "", {
      duration: 1000,
    });
  }

  emptyFun() {
    console.log("Empty");
  }

  getTimeAndPrice(
    event,
    price: number,
    time: number,
    radio: boolean,
    num: number,
    pages: any,
    answer: any,
    chosen: boolean,
    pageID: number,
    i: number,
    page: any,
    questionName: string,
    coefficient: number
  ) {
    /// function for disabling other choices if one is checked
    /// in radio === true objects
    if (radio) {
      pages.forEach((x) => {
        if (x.id !== page.id) {
          x.disabled = !x.disabled;
        }
      });
    }
    console.log(coefficient);
    this.addAnswersIfTheyAreChosen(chosen, answer, pageID, questionName);
    this.estimateService.sendEstimatedTimeAndPrice(
      event,
      price,
      time,
      radio,
      num,
      pageID,
      pages,
      i,
      coefficient
    );
  }

  addAnswersIfTheyAreChosen(
    chosen: boolean,
    answer: any,
    pageID: number,
    questionName: string
  ) {
    /// collect selected answers
    /// if answer is chosen then add it to [this,userAnswer]
    /// else
    /// if you unchecked the answer we will set chosen to false and remove
    /// the last added item in array
    if (!chosen) {
      const answers = {
        questionName: questionName,
        answer: answer,
        choiceID: pageID,
      };
      console.log(answers);
      this.userAnswer.push(answers);
      console.log(this.userAnswer);
    } else {
      this.userAnswer = this.userAnswer.filter(
        ({ choiceID }) => choiceID !== pageID
      );
      console.log(this.userAnswer);
    }
  }

  getUsersAnswers() {
    this.btnLoading = true;
    this.saveAnswersInDB();
    setTimeout(() => {
      this.router
        .navigate(["/estimate/confirmation"])
        .then(() => console.log("Navigation ended"));
    }, 1000);
  }

  @ViewChild("name") name: ElementRef;
  @ViewChild("email") email: ElementRef;
  saveAnswersInDB() {
    /// getting final versions of time and price through estimateService
    const time = this.estimateService.estimatedTimeAndPrice.time;
    const price = this.estimateService.estimatedTimeAndPrice.price;
    /// getting name and email
    const name = this.name.nativeElement.value;
    const email = this.email.nativeElement.value;
    /// call function from usersService to send data to the backend and db
    console.log("Time " + time.toString());
    console.log("price " + price.toString());
    console.log("name " + name.toString());
    console.log("email " + email.toString());
    console.log(this.userAnswer);
    this.usersService.getUsersAnswers(
      this.userAnswer,
      time,
      price,
      name,
      email
    );

    /// reset after submitting
    this.estimateService.estimatedTimeAndPrice.price = 0;
    this.estimateService.estimatedTimeAndPrice.time = 0;
    this.userAnswer = [];
    this.estimateService.finalCoefficient = 0;
  }

  buttonState() {
    if (this.num == this.fetchedJson["pages"].length - 1) {
      return true;
    } else {
      return !this.fetchedJson.pages[this.num].some((page) => page.chosen);
    }
  }

  ///Validation for name input field
  getErrorMessageName() {
    if (this.nameValidation.hasError("required")) {
      this.submitDisabled = true;
      return "You must enter a value";
    }

    if (!this.nameValidation.hasError("required")) {
      this.submitDisabled = false;
      console.log("hahahha");
    }
  }
  getErrorMessageEmail() {
    if (this.emailReg.hasError("required")) {
      return "Email field cant be empty";
    }
  }

  changeWidth() {
    if (this.num === this.fetchedJson["pages"].length - 1) {
      return "200px";
    } else {
      return null;
    }
  }

  ///function that returns a class for input fields based on number of page
  getClass() {
    if (this.num === this.fetchedJson["pages"].length - 1) {
      return "lastPageInput";
    } else {
      return "inputGroup";
    }
  }
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  @ViewChild("stepper") private myStepper: MatStepper;
  goBack(stepper: MatStepper) {
    this.myStepper.previous();
    this.num -= 1;
  }
  goForward(stepper: MatStepper) {
    this.stepper.selected.completed = true;
    this.stepper.selected.editable = false;
    this.myStepper.next();
    this.num += 1;
  }
}
