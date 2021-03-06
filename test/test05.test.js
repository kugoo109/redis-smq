const bluebird = require('bluebird');
const { getConsumer, getProducer, onConsumerIdle } = require('./common');

test('Construct a consumer with messageTTL parameter and make sure it does not consume a message which has been in the queue longer than messageTTL', async () => {
    const producer = getProducer('test_queue');
    const consumer = getConsumer('test_queue', { messageTTL: 2000 });
    const consume = jest.spyOn(consumer, 'consume');

    let messageDestroyed = 0;
    consumer.on('message.destroyed', () => {
        messageDestroyed += 1;
    });

    await producer.produceAsync({ hello: 'world' });
    await bluebird.delay(5000);
    consumer.run();

    await onConsumerIdle(consumer, () => {
        expect(consume).toHaveBeenCalledTimes(0);
        expect(messageDestroyed).toBe(1);
    });
});
