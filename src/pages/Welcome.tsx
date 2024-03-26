import React, { useEffect } from "react";
import { Heading, Image, ScrollView, Text, VStack } from "native-base";
import Button from "../components/Button";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../routes";
import { UtilDevice } from "../util/UtilDevice";

export default function Welcome({ navigation }: BottomTabScreenProps<RootStackParamList, "Welcome">) {
    return (
        <ScrollView flex={1} bg="#010101">
            <VStack py={10} justifyContent="center" alignItems="center">
                <Heading color="#eee">BEM VINDO(A) AO CRYPTOALERT</Heading>
                <Image source={require("../assets/logo.png")} alt="Logo" size={200} />
            </VStack>
            <VStack px={4} space={4}>

                <Text color="#eee">O <Text fontWeight="bold">CRYPTOALERT</Text> é um app para você que não tem tempo e nem se lembra de ficar conferindo os valores das criptomoedas da sua carteira.</Text>

                <Text color="#eee">Com ele você pode criar Alertas de preços para você vender ou comprar mais Criptomoedas. Estes Alertas chegarão para você em forma de notificações push, sim essas que aparecem na barra superior do seu Smartphone.</Text>
        
                <Button title="Acessar minha conta" onPress={() => navigation.navigate("SignIn")}/>

                <Button title="Criar uma conta" onPress={() => navigation.navigate("SignUp")}/>
            </VStack>
        </ScrollView>
    );
}
