"use client"
import React from 'react'

const useOnInteraction = () => {
    const [interacted,setInteracted] = React.useState(false)

   React.useEffect(()=>{
    if(interacted) return;

    const listener = () => {
        setInteracted(true)
    }

    window.addEventListener('mousemove',listener)
    window.addEventListener('touchstart',listener)
    window.addEventListener('scroll',listener)

    return () => {
        window.removeEventListener('mousemove',listener)
        window.removeEventListener('touchstart',listener)
        window.removeEventListener('scroll',listener)
    }
   },[interacted])

 return interacted
}

export {useOnInteraction}