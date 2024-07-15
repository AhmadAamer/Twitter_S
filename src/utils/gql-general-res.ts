import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export function generateGqlResponse<TItem extends object>(
  TItemClass: ClassType<TItem> | ClassType<TItem>[],
  withNoPagination: boolean = false,
) {
  if (Array.isArray(TItemClass)) {
    // graphql res for an array..
    if (withNoPagination) {
      //is row means not to implemet pagination..
      @ObjectType(`Gql${TItemClass[0].name}sResponse`)
      abstract class GqlResponse {
        // Runtime argument
        @Field((type) => [TItemClass[0]])
        data: TItem[];

        @Field()
        status: string;

        @Field()
        message: string;
      }
      console.log(TItemClass[0].name);

      return GqlResponse;
    } else {
      // it means to implement pagination.
      @ObjectType(`Gql${TItemClass[0].name}ItemsResponse`)
      abstract class GqlPaginationRespone {
        @Field((type) => [TItemClass[0]])
        items: TItem[];

        @Field(() => PageInfo)
        pageInfo: PageInfo;
      }
      @ObjectType(`Gql${TItemClass[0].name}PaginationResponse`)
      abstract class GqlResponse {
        @Field((type) => GqlPaginationRespone)
        data: GqlPaginationRespone;

        @Field(() => String)
        status: string;

        @Field(() => String)
        message: string;
      }
      return GqlResponse;
    }
  } else {
    // graghql res for one ..
    @ObjectType(`Gql${TItemClass.name}Response`)
    abstract class GqlResponse implements IRespone<TItem> {
      @Field((type) => TItemClass)
      data: TItem;

      @Field()
      status: string;

      @Field()
      message: string;
    }
    console.log(TItemClass.name);

    return GqlResponse;
  }
}

@ObjectType()
abstract class PageInfo implements IPageInfo {
  @Field(() => Int)
  currentPage: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPages: number;
}

// used interfaces
interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface IRespone<T> {
  status: string;
  message: string;
  data: T;
}

// // reimplement the function that generate a general graphql response .. it would be generic
// export function generateGqlResponse<TItem extends object>(
//   TItemClass: ClassType<TItem> | ClassType<TItem>[], // it may be user or array of users for example..
//   paginate: boolean = true,
// ) {
//   if (Array.isArray(TItemClass)) {
//     // check if TItemClass is an array
//     if (!paginate) {
//       // it means no pagination..
//       @ObjectType(`Gql${TItemClass[0].name}sResponse`)
//       abstract class GqlResponse {
//         @Field((type) => TItemClass[0])
//         data: TItem[];
//         @Field()
//         status: string;
//         @Field()
//         message: string;
//       }
//       return GqlResponse;
//     } else {
//       @ObjectType(`Gql${TItemClass[0].name}ItemResponse`)
//       abstract class GqlPaginationRespone {
//         @Field((type) => [TItemClass[0]])
//         items: TItem[];
//         @Field((type) => PageInfo)
//         pageInfo: PageInfo;
//       }
//       @ObjectType(`Gql${TItemClass[0].name}PaginationResponse`)
//       abstract class GqlResponse {
//         @Field((type) => GqlPaginationRespone)
//         data: GqlPaginationRespone;

//         @Field(() => String)
//         status: string;

//         @Field(() => String)
//         message: string;
//       }
//       console.log(TItemClass[0].name);
//       return GqlResponse;
//     }
//   } else {
//     @ObjectType(`Gql${TItemClass.name}Response`)
//     abstract class GqlResponse implements IRespone<TItem> {
//       @Field((type) => TItemClass)
//       data: TItem;

//       @Field()
//       status: string;

//       @Field()
//       message: string;
//     }
//     console.log(TItemClass.name);
//     return GqlResponse;
//   }
// }
