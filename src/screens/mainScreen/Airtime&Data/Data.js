import React, { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator, ScrollView, Modal, Text, Alert, View, TouchableWithoutFeedback, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { color } from '../../../constants/color'
import { Formik } from 'formik'
import * as Yup from "yup"
import AppButton from '../../../components/AppButtonBlue'
import { mtn, airtel, glo, nineMobile } from '../../../constants/images'
import cred from '../../../config'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { s, vs, ms, mvs, ScaledSheet } from 'react-native-size-matters';
// import { useSelector } from 'react-redux'
import KeyboardAvoidingViewNB from '../../../components/KeyboardAvoidingView'

const AirtimeData = ({ navigation, route }) => {


    const network = [
        { name: "Mtn", image: mtn },
        { name: "Glo", image: glo },
        { name: "Airtel", image: airtel },
        { name: "9mobile", image: nineMobile },
    ]

    const [selectedOption, setSelectedOption] = useState("Airtime")
    const [phase, setPhase] = useState(1)
    const [modalVisible, setModalVisible] = useState(false)
    const [networkValue, setNetworkValue] = useState({ name: "", image: null });
    const [dataPlan, setDataPlan] = useState([])
    const [plan, setPlan] = useState(null)
    const [loading, setIsLoading] = useState(false)
    const [itemCode, setItemCode] = useState("")
    const [tranId, setTranId] = useState("")
    const [amnt, setAmnt] = useState("")

    const handleOptionPress = (option) => {
        setSelectedOption(option)
    }

    const close = () => {
        setModalVisible(false)
    }

    const setValue = (name, image) => {
        setNetworkValue({ name, image });
    };
    const thePlan = (allowance, amount, validity, code) => {
        setItemCode(code)
        setAmnt(amount)
        setPlan({ allowance, amount, validity })
        setDataPlan([])
    }

    useEffect(() => {
        if (phase === 2) {
            setValue('', null);
        } else if (phase === 1) {
            setValue('', null)
        }
    }, [phase]);

    const Schema = Yup.object().shape({
        amount: Yup.string().required('Enter amount'),
        phoneNumber: Yup.string().required('Enter phone number')
    });

    const Schema1 = Yup.object().shape({
        phoneNumber: Yup.string().required('Enter phone number')
    });


    const { auth: { user } } = useSelector(state => state)

    const dataValidate = async (item) => {
        setIsLoading(true)
        const url = `${cred.URL}/vas/data/validation`
        const options = { headers: { Authorization: cred.API_KEY, Token: user.token } }
        const body = {
            "channel": "mobile",
            "service": `${item}data`,
        }

        try {
            const data = await axios.post(url, body, options)
            const { response, transactionId } = data.data
            setTranId(transactionId)
            setDataPlan(response.data)
            setIsLoading(false)

        } catch (error) {
            const { message } = error.response.data
            Alert.alert(`${message}`)
            setIsLoading(false)
        }
    }






    return (
        <>
            <View style={{ flexDirection: "row", marginTop: s(50), marginLeft: s(18) }}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name='arrow-left-thick' size={s(22)} color="black" />
                </TouchableWithoutFeedback>

                <View style={{ justifyContent: "center", marginLeft: s(90) }}>
                    <Text style={{ fontSize: s(16), fontWeight: "bold", color: "black"}}>Buy Data</Text>
                </View>

            </View>

            <View style={{ alignItems: "center", marginTop: s(35) }}>
                <Formik
                    initialValues={{ phoneNumber: "" }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        Schema1.validate(values)
                            .then((res) => {
                                navigation.navigate("DataSummary", { plan: plan.allowance, data: res, networkName: networkValue.name ? networkValue.name : "mtn", itemCode: itemCode, tranId: tranId, amount: amnt, networkImage: networkValue.image ? networkValue.image : mtn })
                            })
                            .catch((err) => Alert.alert('Please provide proper details',));
                    }}>
                    {(props) => {
                        const { handleChange, values, handleSubmit } = props;

                        return (
                            <>
                                <View>
                                    <Text style={{ marginLeft: 5, color: "grey" }}>Enter Phone Number</Text>
                                    <View style={styles.loginContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='Phone Number'
                                            placeholderTextColor="grey"
                                            onChangeText={handleChange('phoneNumber')}
                                            keyboardType='numeric'
                                            maxLength={11}
                                            value={values}
                                        />
                                        <Image source={networkValue.image ? networkValue.image : mtn} style={{ width: 40, height: 40 }} />
                                        <TouchableWithoutFeedback style={styles.serviceContainer} onPress={() => setModalVisible(true)} >
                                            <MaterialCommunityIcons name='chevron-down' size={s(25)} color="grey" />
                                        </TouchableWithoutFeedback>
                                    </View>

                                    {plan && (
                                        <>
                                            <Text style={{ marginLeft: 5 }}>Data Plan</Text>
                                            <View style={styles.dataPlanCont}>
                                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ marginRight: 5, color: "black" }}>{plan.allowance}</Text>
                                                        <Text style={{ color: "black" }}>for</Text>
                                                        <Text style={{ marginLeft: 5, color: "black" }}>₦{`${plan.amount}`}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ color: "black" }}>{plan.validity}</Text>
                                                    </View>
                                                    {/* <View>
                                                        <TouchableWithoutFeedback>
                                                            <MaterialCommunityIcons name='chevron-down' size={30} />
                                                        </TouchableWithoutFeedback>
                                                    </View> */}
                                                </View>
                                            </View>
                                        </>

                                    )}

                                    <Modal
                                        visible={modalVisible}
                                        animationType='slide'
                                        transparent={true}
                                    >


                                        <View style={styles.modalScreen}>
                                            <View style={styles.transparentContainer}></View>
                                            <View style={styles.contentContainer}>

                                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: s(5) }}>
                                                    <TouchableWithoutFeedback onPress={close}>
                                                        <MaterialCommunityIcons name="close-circle" size={s(22)} color="black" />
                                                    </TouchableWithoutFeedback>
                                                </View>

                                                {network.map((item, key) => {
                                                    return (
                                                        <View>
                                                            <TouchableOpacity style={styles.networkContainer} onPress={() => { close(), setValue(item.name, item.image), dataValidate(item.name.toLowerCase()), setPlan(null) }}>
                                                                <Image source={item.image} style={{ width: s(35), height: s(35) }} />
                                                                <Text style={{ marginLeft: s(25), color: "black", fontWeight: "bold", fontSize: s(14), }}>{`${item.name}  Data`}</Text>
                                                            </TouchableOpacity>
                                                            <View style={{ width: "90%", height: 2, backgroundColor: "lightgrey", marginLeft: s(18) }}></View>
                                                        </View>
                                                    )
                                                })}

                                            </View>
                                        </View>

                                    </Modal>

                                    {dataPlan && (
                                        <ScrollView style={{ height: "100%", marginBottom: "50%" }}>
                                            {loading === true ? <ActivityIndicator color="black" /> : null}
                                            {dataPlan.map((item, key) => {
                                                return (
                                                    <TouchableOpacity style={{ marginBottom: s(13) }} key={key} onPress={() => thePlan(item.allowance, item.amount, item.validity, item.code)}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: s(8) }}>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ marginRight: 5, color: "grey" }}>{item.allowance}</Text>
                                                                <Text style={{ color: "grey" }}>for</Text>
                                                                <Text style={{ marginLeft: 5, color: "grey" }}>{`₦${item.amount}`}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={{ color: "grey" }}>{item.validity}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ width: "95%", height: 1, backgroundColor: "lightgrey", marginLeft: s(8), marginTop: 5 }}></View>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </ScrollView>

                                    )}
                                </View>
                                {plan && <AppButton title="Buy Data Bundle" style={{ width: "92%", marginLeft: s(16), position: "absolute", marginTop: "60%" }} onPress={handleSubmit} />}
                            </>
                        );

                    }}

                </Formik>
            </View>


        </>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: s(8),
        padding: s(8),
        borderColor: "white",
        backgroundColor: "white",
        width: '90%',
        height: s(45),
        marginTop: '2%',
        marginBottom: s(22)
    },
    dataPlanCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: s(8),
        padding: s(8),
        borderColor: "white",
        backgroundColor: "white",
        width: '90%',
        height: s(45),
        marginTop: '2%',
        marginBottom: s(22)
    },
    input: {
        flex: 1,
        height: s(35),
        color: "black"
    },

    selectedOption: {
        borderWidth: 2,
        borderColor: color.primary2,
        paddingLeft: s(22),
        paddingRight: s(22),
        paddingTop: s(8),
        paddingBottom: s(8),
        color: "black",
        fontWeight: "600"
    },
    unselectedOption: {
        borderBottomWidth: 0,
        color: "black",
        fontWeight: "600"
    },
    serviceContainer: {
        width: s(75),
        height: (95),
        borderRadius: (8),
        alignItems: "center",
    },
    networkContainer: {
        padding: 5,
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: s(8),
        marginTop: s(16)
    },
    modalScreen: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    transparentContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: s(20),
        borderTopRightRadius: s(20),
        paddingHorizontal: s(10),
        paddingVertical: s(10),
    },
})

export default AirtimeData

