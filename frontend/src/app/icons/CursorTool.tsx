import * as React from "react"

interface SvgProps {
  color:string
}

const SvgComponent = (props:SvgProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4L11.07 20.97L13.58 13.58L20.97 11.07L4 4Z" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default SvgComponent
