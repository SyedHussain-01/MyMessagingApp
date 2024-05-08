import { useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';

const useAuth = (setUser: Function) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(myuser: any) {
    setUser(myuser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    //eslinst-disable-next-line
  }, []);

  if (initializing) return null;

};

export default useAuth
