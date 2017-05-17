using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Core.Entities
{
    public class EasyUIPageSource
    {
        public int total { get; set; }

        private int pageIndex = 1;


        public int PageIndex
        {
            get
            {
                if (pageIndex > MaxPageIndex)
                {
                    pageIndex = MaxPageIndex;
                }
                return pageIndex;
            }
            set { pageIndex = value; }
        }

        private int pagesize = 10;

        public int PageSize
        {
            get
            {
                if (pagesize <= 0)
                {
                    pagesize = 10;
                }
                return pagesize;
            }
            set { pagesize = value; }
        }


        public int MaxPageIndex
        {
            get
            {
                int maxpageindex = 0;

                if (total == 0)
                {
                    maxpageindex = 1;
                }
                else
                {
                    maxpageindex = total / PageSize;

                    if (total % PageSize > 0)
                    {
                        maxpageindex++;
                    }
                }



                return maxpageindex;
            }
        }
        public int EndPageIndex
        {
            get
            {
                if (PageIndex + 8 > MaxPageIndex)
                {
                    return MaxPageIndex;
                }
                else
                {
                    return StartPageIndex + 8;
                }
            }
        }
        public int StartPageIndex
        {
            get
            {
                if (MaxPageIndex < 10)
                {
                    return 1;
                }
                else if (PageIndex - 5 < 0)
                {
                    return 1;
                }
                else if (MaxPageIndex - PageIndex < 5)
                {
                    return MaxPageIndex - 8;
                }
                else
                {
                    return PageIndex - 4;
                }
            }
        }

    }
    public sealed partial class EasyUIPageSource<T> : EasyUIPageSource
    {

        public IEnumerable<T> rows { get; set; }
    }
}
