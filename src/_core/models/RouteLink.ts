export type RouteLink = {
  id?: number;
  // Для отображения
  linkName?: string;

  // Наименование маршрута
  name?: string;

  // Параметры маршрута
  params?: any;

  props?: any;

  query?: any;

  icon: any;

  // Признак видимости
  isVisible?: boolean;

  // Для навигации по якорям внутри страницы (компонента)
  refId?: string;

  // Дополнителная информация
  addInfo?: string;

  // Можно еще что угодно добавлять, в зависимости от требований

  // Для вставки как <a href=""
  href?: string;

  blank?: "" | "_blank";
};
