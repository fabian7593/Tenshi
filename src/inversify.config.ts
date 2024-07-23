import { Container } from 'inversify';
import { default as UserRoutes } from '@user/routers/UserRoutes';
import { default as UdcRoutes } from '@udc/routers/UdcRoutes';
import { default as NotificationRoutes } from '@notification/routers/NotificationRoutes';
import { default as UserNotificationRoutes } from '@notification/routers/UserNotificationRoutes';
import { default as LogRoutes } from '@log/routers/LogRoutes';
import { default as EmailRoutes } from '@email/routers/EmailRoutes';
import { default as DocumentRoutes } from '@document/routers/DocumentRoutes';
import { default as GenericRoutes } from '@generics/Route/GenericRoutes';

const container = new Container();
container.bind(GenericRoutes).toSelf();
container.bind(UserRoutes).toSelf();
container.bind(UdcRoutes).toSelf();
container.bind(NotificationRoutes).toSelf();
container.bind(UserNotificationRoutes).toSelf();
container.bind(LogRoutes).toSelf();
container.bind(EmailRoutes).toSelf();
container.bind(DocumentRoutes).toSelf();
export { container };