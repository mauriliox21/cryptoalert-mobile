import { HStack, Image, Text, VStack, Pressable} from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { AlertResponse } from "../@types";

type CardAlertProps = {
    alert: AlertResponse,
    onPress: () => void,
    onPressDelete: () => void
}

const getIcon = (path: String) => {
    if(path === "bitcoin.png")
        return require("../assets/bitcoin.png");
    else if (path === "ethereum.png")
        return require("../assets/ethereum.png");
}

export default function CardAlert({alert, onPress, onPressDelete}: CardAlertProps) {
    const imgToUp = require("../assets/TO_UP.png", );
    const imgToDown = require("../assets/TO_DOWN.png");
    
    return (
        <Pressable onPress={() => onPress()} >
            <HStack p={2} bg="#333" space={3} borderRadius={15} my={2} w="full">
                <Image flex={2} source={getIcon(alert.cryptocurrency.txPathIcon)} size={70} resizeMode="contain" alt="logo cripitomoeda"/>
                <VStack py={2} flex={7} justifyContent="space-between" alignItems="flex-start">
                    <Text color="#eee" fontWeight="bold" fontSize={16}>{alert.cryptocurrency.nmCryptocurrency + " - " + alert.cryptocurrency.txSymbol}</Text>
                    <Text color="#eee" fontWeight="bold" fontSize={16}>
                        Valor alvo: <Text color={alert.tpAlert === "TO_UP" ? "green.400" : "red.400"}>{alert.nrTargetValue.toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'}).replace(".", "")}</Text> R$
                    </Text>
                </VStack>
                <VStack>
                    <Image flex={1} source={alert.tpAlert === "TO_UP" ? imgToUp : imgToDown} size={30} resizeMode="contain" alt="icone tipo alerta"/>
                    <AntDesign flex={1} name="delete" size={24} color="#666" onPress={onPressDelete}/>

                </VStack>
            </HStack>
        </Pressable>
        
    );
}