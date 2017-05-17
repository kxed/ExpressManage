//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Runtime.Serialization;

#pragma warning disable 1591 // this is for supress no xml comments in public members warnings 

using Domain.Core.Entities;

namespace Domain.ExpressModule.Entities
{
    [DataContract(IsReference = true)]
    [System.CodeDom.Compiler.GeneratedCode("STE-EF",".NET 4.0")]
    #if !SILVERLIGHT
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage()]
    #endif
    public partial class UserInfo: IObjectWithChangeTracker, INotifyPropertyChanged
    {
        #region Primitive Properties
    
        [DataMember]
        public int Id
        {
            get { return _id; }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    OnPropertyChanged("Id");
                }
            }
        }
        private int _id;
    
        [DataMember]
        public string UniqueId
        {
            get { return _uniqueId; }
            set
            {
                if (_uniqueId != value)
                {
                    if (ChangeTracker.ChangeTrackingEnabled && ChangeTracker.State != ObjectState.Added)
                    {
                        throw new InvalidOperationException("The property 'UniqueId' is part of the object's key and cannot be changed. Changes to key properties can only be made when the object is not being tracked or is in the Added state.");
                    }
                    _uniqueId = value;
                    OnPropertyChanged("UniqueId");
                }
            }
        }
        private string _uniqueId;
    
        [DataMember]
        public string UserCode
        {
            get { return _userCode; }
            set
            {
                if (_userCode != value)
                {
                    _userCode = value;
                    OnPropertyChanged("UserCode");
                }
            }
        }
        private string _userCode;
    
        [DataMember]
        public string UserName
        {
            get { return _userName; }
            set
            {
                if (_userName != value)
                {
                    _userName = value;
                    OnPropertyChanged("UserName");
                }
            }
        }
        private string _userName;
    
        [DataMember]
        public string Tel
        {
            get { return _tel; }
            set
            {
                if (_tel != value)
                {
                    _tel = value;
                    OnPropertyChanged("Tel");
                }
            }
        }
        private string _tel;
    
        [DataMember]
        public string PID
        {
            get { return _pID; }
            set
            {
                if (_pID != value)
                {
                    _pID = value;
                    OnPropertyChanged("PID");
                }
            }
        }
        private string _pID;
    
        [DataMember]
        public Nullable<int> Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    OnPropertyChanged("Status");
                }
            }
        }
        private Nullable<int> _status;
    
        [DataMember]
        public Nullable<System.DateTime> EntryTime
        {
            get { return _entryTime; }
            set
            {
                if (_entryTime != value)
                {
                    _entryTime = value;
                    OnPropertyChanged("EntryTime");
                }
            }
        }
        private Nullable<System.DateTime> _entryTime;
    
        [DataMember]
        public string Photo
        {
            get { return _photo; }
            set
            {
                if (_photo != value)
                {
                    _photo = value;
                    OnPropertyChanged("Photo");
                }
            }
        }
        private string _photo;
    
        [DataMember]
        public string PID_Photo
        {
            get { return _pID_Photo; }
            set
            {
                if (_pID_Photo != value)
                {
                    _pID_Photo = value;
                    OnPropertyChanged("PID_Photo");
                }
            }
        }
        private string _pID_Photo;
    
        [DataMember]
        public string ICBC_Photo
        {
            get { return _iCBC_Photo; }
            set
            {
                if (_iCBC_Photo != value)
                {
                    _iCBC_Photo = value;
                    OnPropertyChanged("ICBC_Photo");
                }
            }
        }
        private string _iCBC_Photo;
    
        [DataMember]
        public string Bank
        {
            get { return _bank; }
            set
            {
                if (_bank != value)
                {
                    _bank = value;
                    OnPropertyChanged("Bank");
                }
            }
        }
        private string _bank;
    
        [DataMember]
        public string Bank_CardNo
        {
            get { return _bank_CardNo; }
            set
            {
                if (_bank_CardNo != value)
                {
                    _bank_CardNo = value;
                    OnPropertyChanged("Bank_CardNo");
                }
            }
        }
        private string _bank_CardNo;
    
        [DataMember]
        public string Bank_Detail
        {
            get { return _bank_Detail; }
            set
            {
                if (_bank_Detail != value)
                {
                    _bank_Detail = value;
                    OnPropertyChanged("Bank_Detail");
                }
            }
        }
        private string _bank_Detail;
    
        [DataMember]
        public string UserNickName
        {
            get { return _userNickName; }
            set
            {
                if (_userNickName != value)
                {
                    _userNickName = value;
                    OnPropertyChanged("UserNickName");
                }
            }
        }
        private string _userNickName;
    
        [DataMember]
        public string UserPwd
        {
            get { return _userPwd; }
            set
            {
                if (_userPwd != value)
                {
                    _userPwd = value;
                    OnPropertyChanged("UserPwd");
                }
            }
        }
        private string _userPwd;

        #endregion

        #region ChangeTracking
    
        protected virtual void OnPropertyChanged(String propertyName)
        {
            if (ChangeTracker.State != ObjectState.Added && ChangeTracker.State != ObjectState.Deleted)
            {
                ChangeTracker.State = ObjectState.Modified;
            }
            if (_propertyChanged != null)
            {
                _propertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    
        protected virtual void OnNavigationPropertyChanged(String propertyName)
        {
            if (_propertyChanged != null)
            {
                _propertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    
        event PropertyChangedEventHandler INotifyPropertyChanged.PropertyChanged{ add { _propertyChanged += value; } remove { _propertyChanged -= value; } }
        private event PropertyChangedEventHandler _propertyChanged;
        private ObjectChangeTracker _changeTracker;
    
        [DataMember]
        public ObjectChangeTracker ChangeTracker
        {
            get
            {
                if (_changeTracker == null)
                {
                    _changeTracker = new ObjectChangeTracker();
                    _changeTracker.ObjectStateChanging += HandleObjectStateChanging;
                }
                return _changeTracker;
            }
            set
            {
                if(_changeTracker != null)
                {
                    _changeTracker.ObjectStateChanging -= HandleObjectStateChanging;
                }
                _changeTracker = value;
                if(_changeTracker != null)
                {
                    _changeTracker.ObjectStateChanging += HandleObjectStateChanging;
                }
            }
        }
    
        private void HandleObjectStateChanging(object sender, ObjectStateChangingEventArgs e)
        {
            if (e.NewState == ObjectState.Deleted)
            {
                ClearNavigationProperties();
            }
        }
    
        protected bool IsDeserializing { get; private set; }
    
        [OnDeserializing]
        public void OnDeserializingMethod(StreamingContext context)
        {
            IsDeserializing = true;
        }
    
        [OnDeserialized]
        public void OnDeserializedMethod(StreamingContext context)
        {
            IsDeserializing = false;
            ChangeTracker.ChangeTrackingEnabled = true;
        }
    
        protected virtual void ClearNavigationProperties()
        {
        }

        #endregion

    }
}