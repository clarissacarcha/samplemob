import React from 'react'
import { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native'
import { 
    RenderStore,
    RenderSummary
} from './';
import { 
    carIcon,
    cancelledIcon
} from '../../../../../assets';
import { Hairline } from '../../../../../../components/widgets';
import CustomIcon from './.../../../../../../../Components/Icons';

export const RenderItem = (props) => {
    const { 
        onPressCard,
        onPressBuy,
        fulldata,
    } = props;

    const {
        referenceNum,
        status,
        orders
    } = fulldata;
    const cancelled = status.status === 5;

    return (
        <TouchableOpacity
            onPress={onPressCard}
            style={styles.renderItemButtonContainer}
        >
            <View style={styles.renderItemContainer}>
                <View style={styles.renderItemSubContainer}>
                    <View style={styles.renderItemFirstContainer(cancelled)}>
                        <View style={styles.renderItemFCRight}>
                            <View style={styles.renderItemIDContainer}>
                            <Text style={styles.renderItemIDText}>
                                Oder ID
                            </Text>
                            <Text style={styles.renderItemID}>{referenceNum}</Text>
                            </View>
                            
                            <Text style={styles.renderItemPlaced}>{status.date}</Text>
                        </View>
                        <View style={styles.renderItemFCLeft}>
                            <View style={styles.iconContainer}>
                                {
                                    status.status === 4 ?
                                    <CustomIcon.MCIcon name="check-all" size={15} color={"#F6841F"} />
                                    :
                                    <Image style={styles.renderItemFCLeftIcon} source={cancelled ? cancelledIcon : carIcon}/>
                                }
                            </View>
                            <Text style={styles.renderItemFCLeftText(cancelled)}>{status.description}</Text>
                        </View>
                    </View>

                    <RenderStore data={orders} />

                    <View style={styles.hairLineContainer}>
                        <Hairline />
                    </View>

                    <RenderSummary data={fulldata}/>

                    { onPressBuy && <TouchableOpacity style={styles.buyAgainButton} onPress={onPressBuy} >
                        <Text style={styles.buyAgainText}>Buy Again</Text>
                    </TouchableOpacity> }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        marginRight: 8
    },
    renderItemButtonContainer: {
        flexDirection: 'row'
    },
        renderItemContainer: {
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        flex: 1
    },
    renderItemSubContainer: {
        flex: 1, 
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
    },
    renderItemFirstContainer: (cancelled) => {
        return { 
            height: 64,
            backgroundColor: cancelled ? "#FFFFFF" : "#FFFCF4",
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            borderWidth: cancelled ? 1 : 0,
            borderTopLeftRadius: cancelled ? 5 : 0,
            borderTopRightRadius: cancelled ? 5 : 0,
            borderColor: cancelled ? 'red' : null,
            paddingHorizontal: 16,
            flex: 1
        }
    },
    renderItemFCRight: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    renderItemIDContainer: {
        flexDirection: 'row'
    },
    renderItemIDText: {
        fontWeight: "400",
        fontSize: 13
    },
    renderItemID: {
        color: "#F6841F", 
        marginLeft: 8
    },
    renderItemPlaced: {
        fontWeight: "400",
        fontSize: 11,
        color: "#525252"
    },
    renderItemFCLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    renderItemFCLeftIcon: {
        height: 15, 
        width: 15,
        resizeMode: 'contain',
    },
    renderItemFCLeftText: (cancelled) => {
        return {
            fontSize: 13,
            fontWeight: "400",
            color: cancelled ? "red" : "black"
        }
    },
    hairLineContainer: {
        marginHorizontal: 16, 
        marginVertical: 18
    },
    buyAgainButton: {
        marginHorizontal: 16,
        marginBottom: 16,
        height: 40,
        backgroundColor: "#F6841F",
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyAgainText: {
        color: "#fff", 
        fontSize: 13,
        fontWeight: "600"
    }
})