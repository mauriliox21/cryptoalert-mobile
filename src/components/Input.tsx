import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base";

type InputProps = IInputProps & {
    errorMessage?: string | null;
    title?: string | null; 
}
export default function Input({errorMessage = null, title = null, isInvalid, ...rest}: InputProps){

    const invalid = !!errorMessage || isInvalid;

    return (
        <FormControl isInvalid={invalid}>

            <FormControl.Label fontSize={16} color="#eee" >{title}</FormControl.Label>
        
            <NativeBaseInput 
                bg='#333' 
                borderColor={"#333"}
                color='#eee' 
                borderRadius={10} 
                fontSize='md' 
                h={12}
                _focus={{
                    bg:"#555",
                    borderColor: "#eee"
                }}
                isInvalid={invalid}
                {...rest}   
            />
            <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
        </FormControl>
    );
}