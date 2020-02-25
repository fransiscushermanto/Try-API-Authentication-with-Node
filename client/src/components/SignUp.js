import React from "react";
import { reduxForm, Field } from "redux-form";

const SignUp = () => {
  return (
    <div>
      <form action="">
        <fieldset>
          <Field name="email" type="text" id="email" component="input" />
        </fieldset>
        <fieldset>
          <Field
            name="password"
            type="password"
            id="password"
            component="input"
          />
        </fieldset>
      </form>
    </div>
  );
};

export default SignUp;
