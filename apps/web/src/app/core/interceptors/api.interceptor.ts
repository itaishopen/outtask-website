import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { API_BASE_URL } from '@outtask/data-access';

const API_TIMEOUT_MS = 4000;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);

  if (req.url.startsWith('/api/')) {
    const apiReq = req.clone({ url: `${baseUrl}${req.url.substring(4)}` });
    return next(apiReq).pipe(timeout(API_TIMEOUT_MS));
  }

  return next(req);
};
