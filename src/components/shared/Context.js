import { createContext, useContext, useReducer } from 'react';

// Initial state for your global state
const initialState = {
  // theme: 'dark',
  isGalleryModalOpen: false, // Add the new state property
  lastScrollPosition: 0,
};

// Action types for the reducer
export const ActionTypes = {
  // SET_THEME: 'SET_THEME',
  SET_GALLERY_MODAL_OPEN: 'SET_GALLERY_MODAL_OPEN', // Add the new action type
  // Add more action types as needed
};

// Reducer function to handle state updates
const appReducer = (state, action) => {
  switch (action.type) {
    // case ActionTypes.SET_THEME:
    //   return {
    //     ...state,
    //     theme: action.payload,
    //   };
    case ActionTypes.SET_GALLERY_MODAL_OPEN: // Handle the new action
      return {
        ...state,
        isGalleryModalOpen: action.payload,
      };
    case ActionTypes.SET_LAST_SCROLL_POSITION:
      return {
        ...state,
        lastScrollPosition: action.payload,
      };

    // Add more cases for new state properties

    default:
      return state;
  }
};

// Create the context
const AppContext = createContext();

// Custom provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Optional: Create helper functions for common actions
  const actions = {
    // setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    setGalleryModalOpen: (isOpen) => {
      dispatch({ type: ActionTypes.SET_GALLERY_MODAL_OPEN, payload: isOpen })
      dispatch({ type: ActionTypes.SET_LAST_SCROLL_POSITION, payload: window.pageYOffset })

      // TODO: Disable scroll when the modal is open
      // document.getElementById('appcontent').style.overflowY = isOpen ? 'hidden' : 'visible'
    }, // Add the new helper function
    // Add more helper functions as needed
  };

  const value = {
    ...state,
    ...actions,
    dispatch, // Also provide direct dispatch if needed
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

// Export the context for rare cases where you might need it directly
export default AppContext;