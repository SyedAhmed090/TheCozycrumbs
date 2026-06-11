/**
 * k6 load test — The Cozy Crumb
 *
 * Run:
 *   k6 run load-tests/checkout.js
 *   k6 run --vus 50 --duration 60s load-tests/checkout.js
 *
 * Install k6: https://k6.io/docs/get-started/installation/
 */

import http from 'k6/http'
import { sleep, check } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('error_rate')
const pageLoadTime = new Trend('page_load_ms', true)

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // ramp up to 10 VUs
    { duration: '1m',  target: 20 },  // hold at 20 VUs
    { duration: '30s', target: 0  },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests under 2s
    error_rate:        ['rate<0.01'],   // less than 1% errors
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // Homepage
  let res = http.get(`${BASE_URL}/`)
  pageLoadTime.add(res.timings.duration)
  check(res, { 'homepage 200': (r) => r.status === 200 })
  errorRate.add(res.status !== 200)
  sleep(1)

  // Shop page
  res = http.get(`${BASE_URL}/shop`)
  pageLoadTime.add(res.timings.duration)
  check(res, { 'shop page 200': (r) => r.status === 200 })
  errorRate.add(res.status !== 200)
  sleep(1)

  // Track order page (unauthenticated, no order lookup)
  res = http.get(`${BASE_URL}/track-order`)
  pageLoadTime.add(res.timings.duration)
  check(res, { 'track-order 200': (r) => r.status === 200 })
  errorRate.add(res.status !== 200)
  sleep(1)

  // Checkout page
  res = http.get(`${BASE_URL}/checkout`)
  pageLoadTime.add(res.timings.duration)
  check(res, { 'checkout 200': (r) => r.status === 200 })
  errorRate.add(res.status !== 200)
  sleep(1)

  // Admin login page (should redirect or render the login form)
  res = http.get(`${BASE_URL}/admin/login`, { redirects: 0 })
  check(res, { 'admin login reachable': (r) => r.status === 200 || r.status === 307 })
  errorRate.add(res.status >= 500)
  sleep(1)
}

export function handleSummary(data) {
  return {
    'load-tests/results.json': JSON.stringify(data, null, 2),
  }
}
