import {useSubscription} from '@apollo/react-hooks';
import {ON_DELIVERY_STATUS_CHANGE} from '../../../graphql';

// Status changed to 3,4,5 and 6 only. Doesn't cover accepted, cancelled or deleted.
export const OnDeliveryStatusChangeSubscriber = ({delivery, onFeedReceived}) => {
  const {data, loading, error} = useSubscription(ON_DELIVERY_STATUS_CHANGE, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        delivery: {
          id: delivery.id,
        },
      },
    },
    onSubscriptionData: ({subscriptionData}) => {
      if (subscriptionData.error) {
        return;
      }
      if (!subscriptionData.data.onDeliveryStatusChange) {
        return;
      }
      onFeedReceived({feed: subscriptionData.data.onDeliveryStatusChange});
    },
  });

  return null;
};
