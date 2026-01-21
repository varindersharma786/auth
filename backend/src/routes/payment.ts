// 1. Create the booking in PENDING state
        // Note: In a real app, you might validate availability here again
        const booking = await prisma.booking.create({
            data: {
                tourId,
                userId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                numGuests,
                totalPrice,
                currency,
                status: "PENDING",
                departureId: req.body.departureId,
                paymentType: req.body.paymentType || "FULL_PAYMENT",
                depositPaid: req.body.depositPaid || null,
                balanceDue: req.body.balanceDue || null,
                specialRequests: req.body.specialRequests || null,
                emergencyContact: req.body.emergencyContact || null,
                insuranceRequired: req.body.insuranceRequired || false,
                insuranceDetails: req.body.insuranceDetails || null,
            },
        });

        // 2. Create booking travelers
        if (req.body.travelers && Array.isArray(req.body.travelers)) {
            for (const traveler of req.body.travelers) {
                await prisma.bookingTraveler.create({
                    data: {
                        bookingId: booking.id,
                        title: traveler.title,
                        firstName: traveler.firstName,
                        middleName: traveler.middleName || null,
                        lastName: traveler.lastName,
                        dateOfBirth: new Date(traveler.dateOfBirth),
                        email: traveler.email,
                        phone: traveler.phone,
                        nationality: traveler.nationality || null,
                        passportNo: traveler.passportNo || null,
                        address: traveler.address,
                        isLeadGuest: traveler.isLeadGuest || false,
                    },
                });
            }
        }

        // 3. Create booking room guests
        if (req.body.roomOptionId) {
            // Find the room option to get the type
            const roomOption = await prisma.roomOption.findUnique({
                where: { id: req.body.roomOptionId },
            });
            
            if (roomOption) {
                // Create a booking room guest for each traveler
                const travelers = req.body.travelers || [];
                for (let i = 0; i < travelers.length; i++) {
                    const traveler = travelers[i];
                    await prisma.bookingRoomGuest.create({
                        data: {
                            bookingId: booking.id,
                            roomOptionId: req.body.roomOptionId,
                            guestName: `${traveler.firstName} ${traveler.lastName}`,
                            shareWith: req.body.roommates && req.body.roommates[i] ? req.body.roommates[i].shareWith : null,
                        },
                    });
                }
            }
        }

        // 4. Create booking add-ons
        if (req.body.addOns && Array.isArray(req.body.addOns)) {
            for (const addOn of req.body.addOns) {
                await prisma.bookingAddOn.create({
                    data: {
                        bookingId: booking.id,
                        name: addOn.name,
                        description: addOn.description || null,
                        price: addOn.price,
                        quantity: addOn.quantity || 1,
                    },
                });
            }
        }

        // 5. Create PayPal order
        // Ensure price is a string with 2 decimals
        const amountStr = Number(totalPrice).toFixed(2);
        const orderData = await createOrder(amountStr, currency);

        let orderId: string;
        if ('jsonResponse' in orderData) {
            orderId = orderData.jsonResponse.id;
        } else {
            orderId = orderData.id;
        }