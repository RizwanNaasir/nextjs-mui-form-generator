import React from 'react';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface FormBlueprint {
  id?: string;
  title: string;
  fields: Array<ExtendedFormField>;
  responses?: Array<FormField[]>;
  submissionLimit?: Date | any | Timestamp;
  user_id: string;
}

export interface FormField {
  type: 'text' | 'textarea' | 'email' | 'checkbox' | 'radio' | 'select';
  label: string;
  name: string;
  xs?: number; // Optional property to specify the `xs` value for Grid item
  options?: Array<{ label: string; value: string }>; // Only required for radio and select fields
}

export interface ExtendedFormField extends FormField {
  inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>; // Partial InputProps for HTML input elements
}

export interface FormGeneratorResult {
  formValues: FormField[];
  formElements: JSX.Element[];
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
}
