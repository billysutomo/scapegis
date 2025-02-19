import * as React from "react"

interface SvgProps {
  color: string
}

const SvgComponent = (props: SvgProps) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 3.5V18.5" stroke={props.color} strokeWidth="2" strokeLinecap="round" />
    <path d="M3.5 18.5H18.5" stroke={props.color} strokeWidth="2" strokeLinecap="round" />
    <path d="M21.2071 2.70711C21.5976 2.31658 21.5976 1.68342 21.2071 1.29289C20.8166 0.902369 20.1834 0.902369 19.7929 1.29289L21.2071 2.70711ZM1.29289 19.7929C0.902369 20.1834 0.902369 20.8166 1.29289 21.2071C1.68342 21.5976 2.31658 21.5976 2.70711 21.2071L1.29289 19.7929ZM19.7929 1.29289L1.29289 19.7929L2.70711 21.2071L21.2071 2.70711L19.7929 1.29289Z" fill={props.color} />
    <circle cx="18.5" cy="3.5" r="2.5" fill="white" stroke={props.color} strokeWidth="2" />
    <circle cx="18.5" cy="18.5" r="2.5" fill="white" stroke={props.color} strokeWidth="2" />
    <circle cx="3.5" cy="18.5" r="2.5" fill="white" stroke={props.color} strokeWidth="2" />
  </svg>
)
export default SvgComponent
