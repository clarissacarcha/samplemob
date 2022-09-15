
import moment from "moment";
import { dayTitle , sameDay } from 'toktokwallet/helper';

export const getHeaderDateTitle = ({
    refDate,
    data,
    index
})=> {

    const referenceDate = moment(refDate).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
    let nextItem = [];
    let isSameDay = false;
    let lowerText = '';
    let upperText = '';

    if (data) {
        nextItem = data[index + 1] ? data[index + 1] : false;
        if (index === 0) {
          upperText = dayTitle(referenceDate);
        }
        if (nextItem) {
          let dateNext = moment(nextItem?.node?.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');
          isSameDay = sameDay(referenceDate.toString(), dateNext.toString());
          lowerText = !isSameDay ? dayTitle(dateNext) : '';
        }
    }

    return {
        upperText,
        lowerText
    }
}