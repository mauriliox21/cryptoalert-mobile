import { Alert, Button, CloseIcon, HStack, IToastProps, IconButton, Text, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";

type ToastButton = {
    title: string;
    onPress: () => void;
}

type ToastPros = IToastProps & {
    variant: "error" | "info" | "success" | "warning";
    description: string;
    onPressClose: () => void;
    buttons?: ToastButton[]
}

export default function Toast ({ variant, description, onPressClose, buttons = []}: ToastPros) {
    
    const [defaultColor, setDefaultColor] = useState<string>("");
    const [defaultTitle, setDefaultTitle] = useState<string>("");   

    useEffect(() => {
        if(variant === "error"){
            setDefaultColor("red.");
            setDefaultTitle("Erro");
        }
        else if (variant === "info"){
            setDefaultColor("blue.");
            setDefaultTitle("Info");
        }
        else if (variant === "success"){
            setDefaultColor("green.");
            setDefaultTitle("Sucesso");
        }
        else if (variant === "warning"){
            setDefaultColor("coolGray.");
            setDefaultTitle("Alerta");
        }
    }, []);

    return (
        <Alert maxWidth="96%" alignSelf="center" flexDirection="row" variant="left-accent" status={variant}>
            <VStack space={1} flexShrink={1} w="100%">
                <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text fontSize="md" fontWeight="medium" flexShrink={1} color={defaultColor+"800"}> {defaultTitle} </Text>
                    </HStack>
                    <IconButton 
                        variant="unstyled" 
                        icon={<CloseIcon size="3" />} 
                        _icon={{
                            color: defaultColor+"500"
                        }} 
                        onPress={onPressClose} 
                    />
                </HStack>
                <Text px="6" color={defaultColor+"800"}>
                    {description}
                </Text>
                <HStack display={buttons.length ? "flex" : "none"} flex={1} w="100%" mt={4} alignItems="center" justifyContent="flex-start" space={2}>
                    {buttons.map((btn, index) => (
                        <Button 
                            key={"tbtn"+ index}
                            p={2}
                            onPress={btn.onPress}
                        >
                            {btn.title}
                        </Button>
                    ))}
                </HStack>
            </VStack>
        </Alert>
    )
}
