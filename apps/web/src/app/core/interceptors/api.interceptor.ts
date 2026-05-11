import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '@outtask/data-access';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);

  if (req.url.startsWith('/api/')) {
    const apiReq = req.clone({ url: `${baseUrl}${req.url.substring(4)}` });
    return next(apiReq);
  }

  return next(req);
};
