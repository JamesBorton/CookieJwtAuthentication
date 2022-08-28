import React from 'react';
import {
    Text
} from '@chakra-ui/react'
interface Props {
    message: string | undefined;
}

export default function FormErrorMessageCustom(props: Props) {
 return(
    <>
        {Boolean(props.message) ? (<Text fontSize='xs' color='red'>{props.message}</Text>) : (<Text fontSize='xs' color='red'>&nbsp;</Text>)}
    </>
 )
}