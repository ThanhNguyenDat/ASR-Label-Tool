from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    roles = relationship('UserRole', backref='user', lazy='dynamic')
    
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self) -> str:
        return f"User >>> {self.username} \t {self.roles}"


class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    users = relationship("UserRole", backref="role", lazy='dynamic')

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def __repr__(self) -> str:
        return f"Role >>> {self.name}"

class UserRole(Base):
    __tablename__ = 'user_role'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    role_id = Column(Integer, ForeignKey('role.id'))

    def __repr__(self) -> str:
        return super().__repr__()
