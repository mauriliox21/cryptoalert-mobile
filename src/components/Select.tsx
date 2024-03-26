import { CheckIcon, Select as NativeBaseSelect, ISelectProps, FormControl } from "native-base";

type SelectItem = {
    description: string;
    value: string;
}

type SelectProps = ISelectProps & {
    items: SelectItem[];
    errorMessage?: string | null; 
    title?: string | null; 
}

export default function Select ({items, errorMessage = null, title = null, ...rest}: SelectProps){

    const invalid = !!errorMessage;

    return (
        <FormControl isReadOnly isInvalid={invalid}>

            <FormControl.Label fontSize={16} color="#eee" >{title}</FormControl.Label>

            <NativeBaseSelect 
                fontSize="16"
                color="#eee" 
                bg="#333"  
                w="full" 
                borderRadius={10}
                borderColor={"#333"}
                h={12}
                _selectedItem={{
                    bg: "#fff",
                    endIcon: <CheckIcon size="5"/>,
                    color: "#eee"
                }}
                {...rest}
            >
                {items.map( item => (<NativeBaseSelect.Item key={"si" + item.value} label={item.description} value={item.value}/>))}
            </NativeBaseSelect>

            <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
        </FormControl>
    );
}