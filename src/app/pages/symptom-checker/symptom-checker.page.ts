import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-symptom-checker',
  templateUrl: './symptom-checker.page.html',
  styleUrls: ['./symptom-checker.page.scss'],
})
export class SymptomCheckerPage implements OnInit {
  ionicForm: FormGroup;

  isFormSubmitted = false;

  SYMPTOMS_LIST = [
    { name: 'Fever/Chills', value: 'Fever/Chills'},
    { name: 'Coughing', value: 'Coughing' },
    { name: 'Shortness of breath', value: 'Shortness of breath' },
    { name: 'Body, muscle, and/or headache', value: 'Body, muscle, and/or headache' },
    { name: 'Sore throat', value: 'Sore throat' },
    { name: 'Loss of sense of smell and/or taste', value: 'Loss of sense of smell and/or taste' },
    { name: 'Diarrhea', value: 'Diarrhea' },
    { name: 'None of the above', value: 'None of the above' },
  ];

  SIGNS_LIST = [
    { name: 'Difficulty breathing or gasping for air', value: 'Difficulty breathing or gasping for air'},
    { name: 'Continuous or severe chest pain', value: 'Continuous or severe chest pain'},
    { name: 'Fever worsens', value: 'Fever worsens'},
    { name: 'Lightheaded (may faint or pass out)', value: 'Lightheaded (may faint or pass out)'},
  ];

  constructor(private formBuilder: FormBuilder) {
    this.ionicForm = this.formBuilder.group({
      Symptom_ArrayList: this.formBuilder.array([], [Validators.required]),
      Sign_ArrayList: this.formBuilder.array([], [Validators.required])
    });

    this.onLoadCheckboxStatus();
  }

  updateCheckControl(cal, o) {
    if (o.checked) {
      cal.push(new FormControl(o.value));
    } else {
      cal.controls.forEach((item: FormControl, index) => {
        if (item.value == o.value) {
          cal.removeAt(index);
          return;
        }
      });
    }
  }

  onLoadCheckboxStatus() {
    const Symptom_ArrayList: FormArray = this.ionicForm.get('Symptom_ArrayList') as FormArray;
    this.SYMPTOMS_LIST.forEach(o => {
      this.updateCheckControl(Symptom_ArrayList, o);
    })
    const Sign_ArrayList: FormArray = this.ionicForm.get('Sign_ArrayList') as FormArray;
    this.SIGNS_LIST.forEach(o => {
      this.updateCheckControl(Sign_ArrayList, o);
    })
  }

  //Symptom List
  onSelectionChangeSymptom(e, i) {
    const Symptom_ArrayList: FormArray = this.ionicForm.get('Symptom_ArrayList') as FormArray;
    // this.CHECK_LIST[i].checked = e.target.checked;
    this.updateCheckControl(Symptom_ArrayList, e.target);

  }
  
  //Sign List
  onSelectionChangeSign(e, i) {
    const Sign_ArrayList: FormArray = this.ionicForm.get('Sign_ArrayList') as FormArray;
    // this.CHECK_LIST[i].checked = e.target.checked;
    this.updateCheckControl(Sign_ArrayList, e.target);

  }

  submitForm() {
    this.isFormSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log('Form Submitted', this.ionicForm.value)
    }
  }

  ngOnInit() {}

}
