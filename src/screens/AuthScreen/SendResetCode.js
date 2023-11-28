import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, TextInput, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import { color } from '../../constants/color'
import { Logo, FingerPrint, image } from '../../constants/images'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useFocusEffect } from '@react-navigation/native'

import { Formik } from 'formik';
import * as Yup from 'yup';
import AppButton from '../../components/AppButtonBlue'
import cred from '../../config'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { s, vs, ms, mvs, ScaledSheet } from 'react-native-size-matters';
import TouchID from 'react-native-touch-id'
import DeviceInfo from 'react-native-device-info';




const SendResetCode = ({ navigation, route }) => {

    const data = route.params

    const [loading, setIsLoadking] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    const Schema = Yup.object().shape({
        email: Yup.string().email('invalid email').required('Email field is required'),
    });



    const sendCode = async (res) => {

        const url = `${cred.URL}/auth/send-reset-code`

        try {
            setIsLoadking(true)
            const response = await axios.post(url, res)
            const { status, message, } = response.data
            console.log(response.data)

            if (status === "success") {
                Alert.alert(`${status}`, `${message}`)
                setIsLoadking(false)
                navigation.navigate("ResetPassword", { data: res })
            } else {
                setError(message)
                setIsLoadking(false)
            }



        } catch (error) {
            console.log(error.response.data, 'from catch')
            const { message } = error.response.data
            Alert.alert(`${message}`);
            setIsLoadking(false)
        }
    }

    return (
        <>

            <View style={styles.container}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: s(50) }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={s(22)} color="#49001b" />
                    </TouchableOpacity>
                    <Image />
                    <Text></Text>
                </View>
                <View style={{ marginTop: s(35) }}>
                    <Text style={{ fontSize: s(22), fontWeight: "bold", color: "#49001b" }}>Forgot Password?</Text>
                    <Text style={{ fontSize: s(10), fontWeight: "300", color: "#49001b", marginTop: s(5) }}>Reset it with your registered email</Text>
                </View>
                <View>
                    <Formik
                        initialValues={{ email: "" }}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            Schema.validate(values)
                                .then((res) => {
                                    sendCode(res)
                                })
                                .catch((err) => Alert.alert(`${err}`));
                        }}>
                        {(props) => {
                            const { handleChange, values, handleSubmit } = props;

                            return (
                                <View style={{ marginTop: s(40) }}>
                                    <Text style={{ color: "#49001b", marginBottom: s(10), fontSize: s(12), marginLeft: s(5) }}>Email</Text>
                                    <View style={styles.loginContainer2}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Enter Your Email Address'
                                            placeholderTextColor="#49001b"
                                            onChangeText={handleChange('email')}
                                            value={values.email}
                                        />
                                    </View>

                                    <AppButton title="Send Reset Code" onPress={handleSubmit} isSubmitting={loading} style={styles.btn} />
                                    {/* <View style={{ marginTop: s(30), marginRight: s(5), alignItems: "flex-start" }}>
                                        <Text style={{ color: "#868686", fontSize: s(12), fontWeight: "500" }}>Didn't get the email? <TouchableWithoutFeedback onPress={() => console.log("press")}><Text style={{ color: "#3483f5" }}>Send another email please</Text></TouchableWithoutFeedback></Text>
                                    </View> */}

                                </View>
                            );
                        }}
                    </Formik>
                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: s(8)

    },
    profileImage: {
        width: s(100),
        height: s(100),
        borderWidth: s(6),
        borderRadius: s(100),
        borderColor: color.colorOne,
        backgroundColor: "white",
        marginTop: s(18),
        justifyContent: "center", alignItems: "center"
    },
    loginContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: s(1.5),
        borderRadius: s(50),
        padding: ms(10),
        borderColor: "#49001b",
        backgroundColor: "white",
        width: '100%',
        height: s(55),
        marginBottom: s(30),
    },
    input: {
        flex: 1,
        height: s(40),
        color: "black",
        paddingLeft: s(10),
        fontSize: s(15)
    },
    btn: {
        marginTop: s(15),
        height: s(50)
    }
})

export default SendResetCode

