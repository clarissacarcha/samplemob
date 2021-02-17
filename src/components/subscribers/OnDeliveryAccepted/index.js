import {useSubscription} from '@apollo/react-hooks';
import {ON_DELIVERY_ACCEPTED} from '../../../graphql';

// Status changed for accepting order only.
export const OnDeliveryAcceptedSubscriber = ({delivery, onFeedReceived}) => {
  const {data, loading, error} = useSubscription(ON_DELIVERY_ACCEPTED, {
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
      if (!subscriptionData.data.onDeliveryAccepted) {
        return;
      }
      onFeedReceived({feed: subscriptionData.data.onDeliveryAccepted});
    },
  });

  return null;
};
