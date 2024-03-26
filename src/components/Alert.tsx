import { CloseIcon, HStack, IconButton, Alert as NativeBaseAlert, IAlertProps, Text, VStack } from "native-base";

type AlertProps = IAlertProps & {
    message?: string | null;
}

export default function Alert({status, message, ...rest}: AlertProps){
    const visible = !!message;
    return (
        <NativeBaseAlert maxWidth="96%" status={status} display={visible ? "flex" : "none"} {...rest}>
            <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1} justifyContent="center" alignItems="center">
                        <NativeBaseAlert.Icon />
                        <Text fontSize="md" color="coolGray.800">{message}</Text>
                    </HStack>
                    <IconButton 
                        variant="unstyled" 
                        _focus={{ borderWidth: 0 }} 
                        icon={<CloseIcon size="3" />} 
                        _icon={{color: "coolGray.600"}} 
                        onPress={rest.onTouchCancel}
                    />
                </HStack>
            </VStack>
        </NativeBaseAlert>
    );
}