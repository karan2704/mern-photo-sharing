import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useHttpClient} from "../../Shared/Hooks/http-hook"

import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner"
import PlaceList from '../Components/PlaceList';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async() => {
      try{
        console.log(userId);
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
        setLoadedPlaces(responseData.places);

      } catch(err){}
    };
    fetchPlaces();

  }, [sendRequest, userId]);

  const deleteHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && <div className="center"> <LoadingSpinner asOverlay /> </div>}
    {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDelete={deleteHandler}/>}
    </React.Fragment>
  )
};

export default UserPlaces;
