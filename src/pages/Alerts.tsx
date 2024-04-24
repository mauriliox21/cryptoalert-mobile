import React, {useEffect} from "react";
import { Box, Button, ChevronDownIcon, FlatList, HStack, Image, Menu, Pressable, Spinner, Text, VStack, useToast } from "native-base";
import CardAlert from "../components/CardAlert";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../routes";
import { useState } from "react";
import { useUserRepository } from "../database/useUserRepository";
import { AxiosInstance } from "../config/AxiosInstace";
import { AxiosError, AxiosResponse } from "axios";
import { AlertResponse, DefaultGetResponse } from "../@types";
import Toast from "../components/Toast";



export default function Alerts({ navigation, route }: BottomTabScreenProps<RootStackParamList, "Alerts">) {

    const toast = useToast();

    const userRepository = useUserRepository();
    const [nameUser, setNameUser] = useState((userRepository.getName() ?? "").split(" ")[0]);
    const [alerts, setAlerts] = useState<AlertResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllAlerts = () => {
        setIsLoading(true);
        setAlerts([]);
        AxiosInstance.get("/alerts?sort=id&size=20")
        .then((res: AxiosResponse<DefaultGetResponse<AlertResponse>, any>) => {
            setAlerts(res.data.content);
        })
        .catch((error: AxiosError) => {
            console.error("erro ao consultar")
            if(error.response?.status === 401){
                navigation.navigate("SignIn");
            }
            else{
                console.log(error.response?.status);
                console.log(error.response?.data);
            }
        })
        .finally(() => setIsLoading(false));
    }

    const handleDelete = (idAlert: number) => {
        toast.show({
            placement: "top" ,
            render: (({id}) => (
                <Toast
                    description="Excluir um alerta é uma ação irreversível, deseja realmente continuar?" 
                    variant="info" 
                    onPressClose={() => toast.close(id)}
                    buttons={[
                        { title: "SIM", onPress: () => {handleConfirmDelete(idAlert); toast.close(id); }}, 
                        { title: "NÃO", onPress: () => toast.close(id)}
                    ]} 
                />)), 
            duration: 1000 * 60 * 5
        })
    }

    const showSuccessMsg = (message: string) => {
        toast.show({
            placement: "top" ,
            render: (({id}) => (
                <Toast 
                    title="Sucesso" 
                    description={message} 
                    variant="success" 
                    onPressClose={() => toast.close(id)}
                />)), 
            duration: 1000 * 60
        })
    }

    const handleConfirmDelete = (idAlert: number) => {
        AxiosInstance.delete(`/alerts/${idAlert}`)
        .then(()=> {
            setAlerts(alerts.filter(alert => alert.id !== idAlert));
        })
        .catch((error: AxiosError) => {
            console.log(error.response?.status);
            console.log(error.response?.data);
        });
    }

    const logout = () => {
        userRepository.deleteAll();
        navigation.navigate("SignIn");
    }

    useEffect(() => {
        if(!route.params || route.params.refreshList)
            getAllAlerts();

        if(route.params?.successMsg)
            showSuccessMsg(route.params?.successMsg);

    }, [route]);

    return (
        <VStack flex={1} bg={"#010101"}>

            <HStack flex={1} px="4" alignItems="center" justifyContent="flex-start" space={4}>
                <Image source={require("../assets/logo.png")} size="sm" resizeMode="contain" alt="Cryptoalert" />
                <Text color="#eee" fontSize={18} bold>Olá, {nameUser}</Text>
                <Box alignItems="center">
                    <Menu
                        bg="#333"
                        color="#eee"
                        p="0"
                        trigger={triggerProps => (
                            <Pressable p="2" accessibilityLabel="Abrir" {...triggerProps}>
                                <ChevronDownIcon />
                            </Pressable>
                        )}>
                            <Menu.Item onPress={logout}><Text color="#eee" fontWeight="extrabold">Sair do meu Perfil</Text></Menu.Item>
                    </Menu>
                </Box>
            </HStack>

            <VStack flex={6} px='5'>
                {
                    isLoading
                    ?
                    (
                        <VStack flex={5} justifyContent="center">
                            <Spinner mt={-100} size={60} color="#FFC742" alignSelf="center" accessibilityLabel="Carregando Alertas"/>
                        </VStack>

                    )
                    :
                    (
                        <FlatList 
                            _contentContainerStyle={{pb: 24}}
                            data={alerts} 
                            keyExtractor={item => item.id.toString()}
                            renderItem={(alert) => 
                                (<CardAlert 
                                    alert={alert.item}  
                                    onPress={() => navigation.navigate("CreateAlert", { idAlert : alert.item.id})}
                                    onPressDelete={() => handleDelete(alert.item.id)}
                                />)
                            } 
                        /> 
                    )
                }
            </VStack>

            <Button 
                h={60} w={60} 
                bottom={3} right={3} position="absolute" 
                bg="#dda129" 
                justifyContent="center" alignItems="center"
                borderRadius="full"
                borderColor="#eee"
                borderWidth={3}
                style={{
                    shadowOffset: {width: 0, height: 4},
                    shadowColor: "#000", 
                    shadowOpacity: 1,
                    shadowRadius: 1.51,
                    elevation: 5
                }}
                _pressed={{
                    bg: "#FFC742"
                }}
                onPress={() => navigation.navigate("CreateAlert")}
            >
                <Text m={0} p={0} fontSize={36} lineHeight={39} letterSpacing="xs" color="#eee">+</Text>
            </Button>

        </VStack>
    );
}