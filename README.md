Repository Pattern
Repository = CRUD các entities
UnitOfWork = Commit các thay đổi (SaveChangesAsync)
Service chịu trách nhiệm logic nghiệp vụ và giao tiếp với bên thứ ba (Stripe)
vi mot so li do ve EF nen khi xoa basket hay user phai xoa payment
Sử dụng GHN API để lấy danh sách xã huyện tỉnh,..
API Get Province: https://api.ghn.vn/home/docs/detail?id=60
Get Ward: https://api.ghn.vn/home/docs/detail?id=61
Get District: https://api.ghn.vn/home/docs/detail?id=78

cau hinh api GHN o address controll
o FE, khi call api, add  withCredentials: true, nham gui cookie kem theo yeu cau