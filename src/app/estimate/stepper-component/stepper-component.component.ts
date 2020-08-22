import {Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import { ViewChild } from "@angular/core";
import { EstimateService } from "../estimate.service";
import { MatStepper } from "@angular/material/stepper";
import { NgForm } from "@angular/forms";
import {QuestionService} from "../../home/question.service";
import {Subscription} from "rxjs";
import {UsersService} from "../../services/user.service";

@Component({
  selector: "app-stepper-component",
  templateUrl: "./stepper-component.component.html",
  styleUrls: ["./stepper-component.component.css"],
})
export class StepperComponentComponent implements  OnInit, OnDestroy {
  constructor(public estimateService: EstimateService, public questionService: QuestionService, public usersService: UsersService) {}

  fetchedJson;
  num = 0;
  checked = false;
  userAnswer = [];
  isLoading =  false; 

  hideSpinner(){
    this.isLoading = false;
  }

  private questionSubscription: Subscription;

  ngOnInit(): void {
   this.questionService.getQuestions();
    // this.isLoading = true;
    this.questionSubscription = this.questionService.getQuestionsUpdated()
        .subscribe((questions) => {
          setTimeout(this.hideSpinner.bind(this),2000)
          this.fetchedJson = questions.questions[0];
            console.log(this.fetchedJson)
        })
  }

  ngOnDestroy(): void {
     this.questionSubscription.unsubscribe();
  }


  //  onClick(radio: boolean, pages: any) {
  //    if(radio) {
  //        var a = document.getElementsByClassName('radio');
  //        var newvar = 0;
  //        var count;
  //        for(count = 0; count < a.length; count++) {
  //          var aa = a[count] as HTMLInputElement ;
  //          console.log(aa);
  //            if(aa.checked === true) {
  //              newvar = newvar + 1;
  //              console.log(newvar.toString() +
  //                  'NEW WAR');
  //              console.log(aa.id);

  //            }

  //          if(newvar >= 3) {
  //            console.log('FALSE');
  //            aa.checked = false;
  //            return false;

  //          }
  //          // if(allow2Var === true) {
  //          //   console.log('PRINT');
  //          //   if(newvar >= 3) {
  //          //     console.log('FALSE');
  //          //     return false;
  //          //
  //          //   }
  //          // }
  //        }

  //    }
  //  }

  // this.searchElement.nativeElement.focus();

  getTimeAndPrice(event, price: number, time: number, radio: boolean, num: number, pages:any, answer: any, chosen: boolean) {
    this.estimateService.sendEstimatedTimeAndPrice(event, price, time, radio, num);
    this.addAnswersIfTheyAreChosen(chosen, answer);
  }

  addAnswersIfTheyAreChosen(chosen: boolean, answer: any) {
    /// collect selected answers
    /// if answer is chosen then add it to [this,userAnswer]
    /// else
    /// if you unchecked the answer we will set chosen to false and remove
    /// the last added item in array
    if(chosen) {
      const answers = {
        answer: answer
      }
      console.log(answers);
      this.userAnswer.push(answers);
      console.log(this.userAnswer);
    } else {
      this.userAnswer.splice(-1,1);
      console.log(this.userAnswer);
    }
  }


  @ViewChild('name') name: ElementRef;
  @ViewChild('email') email: ElementRef;
  getUsersAnswers() {
     /// getting final versions of time and price through estimateService
     const time = this.estimateService.estimatedTimeAndPrice.time;
     const price = this.estimateService.estimatedTimeAndPrice.price;
     /// getting name and email
     const name = this.name.nativeElement.value;
     const email = this.email.nativeElement.value;
     /// call function from usersService to send data to the backend and db
    console.log('Time ' + time.toString());
    console.log('price ' + price.toString());
    console.log('name ' + name.toString());
    console.log('email ' + email.toString());
    console.log(this.userAnswer);
    this.usersService.getUsersAnswers(this.userAnswer, time, price, name, email);


    /// reset after submitting
    this.estimateService.estimatedTimeAndPrice.price = 0;
    this.estimateService.estimatedTimeAndPrice.time = 0;
    this.userAnswer = [];
  }

  buttonState() {
    if (this.num == this.fetchedJson['pages'].length - 1) {
      return true;
    } else {
      return !this.fetchedJson.pages[this.num].some((page) => page.chosen);
    }
  }

  changeWidth() {
    if (this.num === this.fetchedJson['pages'].length - 1) {
      return "200px";
    } else {
      return null;
    }
  }

  @ViewChild("stepper") private myStepper: MatStepper;
  goBack(stepper: MatStepper) {
    this.myStepper.previous();
    this.num -= 1;
  }
  goForward(stepper: MatStepper, answer: any) {
    this.myStepper.next();
    this.num += 1;
  }
  onSendEmail(form: NgForm) {
    console.log("users name is ", form.value.name);
    console.log("users email is ", form.value.email);
  }
}
