import { useRef, useEffect } from 'react'

function DocumentTitle(title: string) {

  useEffect(() => {
    document.title = title + " | FitnFi ";
  }, [title]);
}
export default DocumentTitle