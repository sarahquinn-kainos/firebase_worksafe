import { Card, Center, Text, VStack, HStack } from 'native-base';


function displaySingleWorkshiftCard(data) {

    const WorkshiftCard = () => {
        console.log(data)
        var d = data;
        var date = d.date.toDate().toLocaleDateString();
        var startTime = d.start_datetime.toDate().toLocaleTimeString('en-gb')
        var endTime = d.end_datetime.toDate().toLocaleTimeString('en-gb')
        var staff_array = new Array;
        var shift_id = d.id
        staff_array = d.staff;
        return (
            <>
                <Card id={shift_id} style={{ width: 300 }} mt={80}>
                    <Center>
                        <VStack>
                            <Center><Text> {date}</Text></Center>
                            <HStack pt="1">
                                <Text bold>Start:  </Text>
                                <Text> {startTime}</Text>
                            </HStack>
                            <HStack pt="1">
                                <Text bold>End:  </Text>
                                <Text> {endTime}</Text>
                            </HStack>
                            <Text>{"\n"}</Text>
                            <VStack pt="1">
                                <Center><Text bold underline>Staff</Text></Center>
                                <Text>{"\n"}</Text>
                                <VStack>
                                    {
                                        staff_array ?
                                            staff_array.map((staff) => {
                                                return (
                                                    <Text>
                                                        {staff.display_name}
                                                    </Text>
                                                )
                                            }) :
                                            null}
                                </VStack>
                                <Text>{"\n"}</Text>
                            </VStack>
                        </VStack>
                    </Center>
                </Card>
                <Text>{"\n"}</Text>
            </>
        )
    }

    return (
        <Center>
            <VStack mt="4">

                {data ? <WorkshiftCard/>
                     : null}
            </VStack>
        </Center>
    );
}



export default displaySingleWorkshiftCard;