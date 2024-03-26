import { Button as NativeBaseButton, IButtonProps, Text, Spinner } from "native-base";

type ButtonProps = IButtonProps & {
    title: string
}

export default function Button( {title, ...rest}: ButtonProps) {
    return (
        <NativeBaseButton
            w="full"
            borderRadius={20}
            py='3'
            alignItems="center"
            justifyContent="center"
            bg="#dda129"
            _pressed={{
                bg:"#FFC742"
            }}
            {...rest}
        >
            <Text fontSize="md" fontWeight="bold" color="#fff">{title}</Text>    
        </NativeBaseButton>
    )
}