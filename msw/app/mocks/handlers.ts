import { http, HttpResponse } from 'msw'

export const handlers = [
  // Intercept "GET ${process.env.API_BASE}/user" requests...
  http.get(`${process.env.API_BASE}/user`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
