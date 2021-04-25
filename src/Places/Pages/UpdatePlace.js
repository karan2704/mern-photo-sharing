import React, {useState, useEffect, useContext} from 'react';
import { useParams , useHistory} from 'react-router-dom';

import Input from '../../Shared/Components/FormElements/Input';
import Button from '../../Shared/Components/FormElements/Button';
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal"
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../Shared/Components/Util/Validators';
import { useHttpClient } from "../../Shared/Hooks/http-hook"
import { useForm } from '../../Shared/Hooks/form-hook';
import Card from "../../Shared/Components/UIElements/Card.js";
import {AuthContext} from "../../Shared/Context/auth-context";


import './NewPlace.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState()
  const placeId = useParams().placeId;
  const history = useHistory()

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );


  useEffect(() => {
    const fetchPlace = async () => {
      try{
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
          setLoadedPlace(responseData.place)
          setFormData(
            {
              title: {
                value: responseData.place.title,
                isValid: true
              },
              description: {
                value: responseData.place.description,
                isValid: true
              }
            },
          true
        );
      } catch(err) {}
    };
    fetchPlace()
  }, [sendRequest, placeId, setFormData])


  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    await sendRequest(`http://localhost:5000/api/places/${placeId}`, "PATCH",
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }),
      {
        "Content-Type": "application/json"
      }
    );
    history.push("/" + auth.userId + "/places")
  };

  if (isLoading){
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !isLoading) {
    return (
      <div className="center">
        <Card>Could not find place!</Card>
      </div>
    );
  }




  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;
