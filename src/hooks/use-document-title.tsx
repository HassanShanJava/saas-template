import { useRef, useEffect } from 'react'
const { VITE_PROJECT_NAME } = import.meta.env;
function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title + ` | ${VITE_PROJECT_NAME}`;
  }, [title]);

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
    }
  }, [])
}
export default useDocumentTitle
