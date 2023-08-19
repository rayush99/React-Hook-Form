import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

const YouTubeForm = () => {
  const form = useForm({
    // defaultValues: async ()=>{
    //   const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    //   const data = await response.json();
    //   return {
    //     username: data.username,
    //     email : data.email,
    //     channel: ""
    //   }
    // }
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        // Adding nested objects
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age:0,
      dob: new Date()
    },
  });

  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset } = form;
  const { errors, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful,submitCount } = formState;

  console.log("isDirty",isDirty) // Tracks whether user has updated any field in the form.
  console.log("isValid",isValid) // This property becomes true when there are no errors in the form fields.
  console.log("isSubmitting", isSubmitting) //This property allows you to track whether a form is in the process of being submitted.
  console.log("isSubmitted", isSubmitted) //The isSubmitted property allows you to track whether a form has been submitted.
  console.log("isSubmitSuccessfull", isSubmitSuccessful) //The isSubmitSucsessful property indicates that form was successfully submitted without any runtime errors.
  console.log("submitCount", submitCount) //keeps track how many times the form was submitted

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data) => {
    console.log("Form Submitted");
    console.log(data);
  };

  const onError = (errors) =>{
    console.log("form errors",errors)
  }

  const watchUsername = watch('username');

  const handleGetValues = () =>{
    console.log("get value", getValues('social'))
  }

  const handleSetValue = () =>{
    setValue('username',"",{
      // shouldValidate:true,
      shouldTouch: true,
      shouldDirty: true
    });
  }

  useEffect(()=>{
    if(isSubmitSuccessful){
      reset();
    }
  },[isSubmitSuccessful])

  return (
    <div>
      {console.log("username",watchUsername)}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid Email format",
              },
              validate: {
                notAdmin: (fieldvalue) => {
                  return (
                    fieldvalue !== "admin@example.com" ||
                    "Enter a different value"
                  );
                },
                notBlackListed: (fieldvalue) => {
                  return (
                    !fieldvalue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: { value: true, message: "Channel is required" },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              disabled: watch('channel') === "",
              required: { value: true, message: "Twitter is required", },
            })}
          />
          <p className="error">{errors.social?.twitter?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: { value: true, message: "Facebook is required" },
            })}
          />
          <p className="error">{errors.social?.facebook?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0", {
              required: {
                value: true,
                message: "Please enter primary phone number",
              },
            })}
          />
          {/* <p className="error">{errors.phoneNumbers?.[0].message}</p> */}
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1", {
              required: {
                value: true,
                message: "Please enter secondary phone number",
              },
            })}
          />
          {/* <p className="error">{errors.phoneNumbers?.[1]?.message}</p> */}
        </div>

        <div className="form-control">
          <label htmlFor="">List of Phone Numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number`)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                append({ number: "" });
              }}
            >
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber:true,
              required: { value: true, message: "Age is required" },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">DOB</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: { value: true, message: "Dob is required" },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button disabled={!isDirty || !isValid}>Submit</button>
        <button type="button" onClick={()=>{reset()}}>Reset</button>
        <button type="button" onClick={handleGetValues}>Get Values</button>
        <button type="button" onClick={handleSetValue}>Set Values</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;
