import { generateAccessToken, paypal } from '../lib/paypal';

// Test to generate access token from paypal
test('generates token from paypal', async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test to create a paypal order
test('creates a paypal order', async () => {
    const token = await generateAccessToken();
    const price = 10.0;

    const orderResponse = await paypal.createOrder(price);
    console.log(orderResponse);

    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty("status");
    expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with mock order
test("simulates capturing payment with mock order", async () => {
    const orderId = "100";
    const mockCapturePayment = jest.spyOn(paypal, "capturePayment").mockResolvedValue({
        id: orderId,
        status: "COMPLETED",
    });

    const captureRes = await paypal.capturePayment(orderId);
    console.log(captureRes);
    expect(captureRes).toHaveProperty("id");
    expect(captureRes).toHaveProperty("status");
    expect(captureRes.id).toBe(orderId);
    expect(captureRes.status).toBe("COMPLETED");

    mockCapturePayment.mockRestore();
});
